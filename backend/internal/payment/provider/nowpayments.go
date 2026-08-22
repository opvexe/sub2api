package provider

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"sort"
	"strings"
	"time"

	"github.com/shopspring/decimal"

	"github.com/Wei-Shaw/sub2api/internal/payment"
)

// NOWPayments 直连支付（POST /v1/payment）：下单即返回链上收款地址与精确到账
// 金额，用户自行转账，状态变化通过 IPN 回调推送。
//
// 之所以不用托管收银台（POST /v1/invoice）：invoice 返回的是 invoice id 而非
// payment_id，而对账依赖 GET /v1/payment/{payment_id}，用 invoice 流程拿不到
// 可查询的 ID，QueryOrder 就成了摆设。直连流程的每个字段都能对上已有的
// QRCode / QueryOrder 契约。
const (
	nowPaymentsAPIBase      = "https://api.nowpayments.io/v1"
	nowPaymentsHTTPTimeout  = 20 * time.Second
	nowPaymentsMaxRespSize  = 1 << 20
	nowPaymentsMaxErrDetail = 512

	// 上游状态，取自 NOWPayments 官方文档。
	nowPaymentsStatusWaiting       = "waiting"        // 已下单，尚未收到转账
	nowPaymentsStatusConfirming    = "confirming"     // 链上确认中
	nowPaymentsStatusConfirmed     = "confirmed"      // 链上已确认，资金已计入商户 NOWPayments 余额
	nowPaymentsStatusSending       = "sending"        // 正在结算到商户 payout 钱包
	nowPaymentsStatusPartiallyPaid = "partially_paid" // 收到转账但金额不足
	nowPaymentsStatusFinished      = "finished"       // payout 落地，整条链路完成
	nowPaymentsStatusFailed        = "failed"         // 失败
	nowPaymentsStatusRefunded      = "refunded"       // 已退回用户
	nowPaymentsStatusExpired       = "expired"        // 7 天内未收到转账
)

// NowPayments implements payment.Provider on top of the NOWPayments API.
type NowPayments struct {
	instanceID string
	config     map[string]string
	httpClient *http.Client
}

// NewNowPayments constructs a NOWPayments provider instance.
//
// 必填配置：
//   - apiKey     商户 API Key，作为 x-api-key 头发送
//   - ipnSecret  IPN 密钥，用于校验回调签名。缺失则任何人都能伪造到账通知，
//     因此这里强制要求，不提供「不校验」的降级路径。
//   - payCurrency 收款币种代码，例如 usdttrc20（USDT-TRC20）、usdterc20。
func NewNowPayments(instanceID string, config map[string]string) (*NowPayments, error) {
	for _, k := range []string{"apiKey", "ipnSecret", "payCurrency"} {
		if strings.TrimSpace(config[k]) == "" {
			return nil, fmt.Errorf("nowpayments config missing required key: %s", k)
		}
	}
	cfg := cloneStringMap(config)
	cfg["apiKey"] = strings.TrimSpace(cfg["apiKey"])
	cfg["ipnSecret"] = strings.TrimSpace(cfg["ipnSecret"])
	cfg["payCurrency"] = strings.ToLower(strings.TrimSpace(cfg["payCurrency"]))

	if base := strings.TrimSpace(cfg["apiBase"]); base != "" {
		normalized, err := normalizeNowPaymentsAPIBase(base)
		if err != nil {
			return nil, err
		}
		cfg["apiBase"] = normalized
	} else {
		cfg["apiBase"] = nowPaymentsAPIBase
	}

	// 计价币种：NOWPayments 按 price_currency 计价再折算成 payCurrency 的链上金额。
	currency, err := payment.NormalizePaymentCurrency(cfg["currency"])
	if err != nil {
		return nil, fmt.Errorf("nowpayments config currency: %w", err)
	}
	cfg["currency"] = currency

	return &NowPayments{instanceID: instanceID, config: cfg}, nil
}

func normalizeNowPaymentsAPIBase(raw string) (string, error) {
	trimmed := strings.TrimRight(strings.TrimSpace(raw), "/")
	u, err := url.Parse(trimmed)
	if err != nil || u.Scheme != "https" || u.Host == "" {
		return "", fmt.Errorf("nowpayments apiBase must be an absolute https URL")
	}
	return trimmed, nil
}

func (n *NowPayments) Name() string        { return "NOWPayments" }
func (n *NowPayments) ProviderKey() string { return payment.TypeNowPayments }

func (n *NowPayments) SupportedTypes() []payment.PaymentType {
	return []payment.PaymentType{payment.TypeNowPayments}
}

// MerchantIdentityMetadata 只暴露非敏感字段，用于订单快照的一致性校验。
func (n *NowPayments) MerchantIdentityMetadata() map[string]string {
	return map[string]string{
		"provider":    payment.TypeNowPayments,
		"payCurrency": n.config["payCurrency"],
		"currency":    n.config["currency"],
	}
}

func (n *NowPayments) currency() string {
	if c := strings.TrimSpace(n.config["currency"]); c != "" {
		return strings.ToLower(c)
	}
	return "usd"
}

type nowPaymentsCreateRequest struct {
	PriceAmount      float64 `json:"price_amount"`
	PriceCurrency    string  `json:"price_currency"`
	PayCurrency      string  `json:"pay_currency"`
	OrderID          string  `json:"order_id"`
	OrderDescription string  `json:"order_description,omitempty"`
	IPNCallbackURL   string  `json:"ipn_callback_url,omitempty"`
}

type nowPaymentsPayment struct {
	PaymentID        json.Number `json:"payment_id"`
	PaymentStatus    string      `json:"payment_status"`
	PayAddress       string      `json:"pay_address"`
	PayAmount        json.Number `json:"pay_amount"`
	PayCurrency      string      `json:"pay_currency"`
	PriceAmount      json.Number `json:"price_amount"`
	PriceCurrency    string      `json:"price_currency"`
	ActuallyPaid     json.Number `json:"actually_paid"`
	OrderID          string      `json:"order_id"`
	OrderDescription string      `json:"order_description"`
	PurchaseID       string      `json:"purchase_id"`
	CreatedAt        string      `json:"created_at"`
	UpdatedAt        string      `json:"updated_at"`
	PayinExtraID     string      `json:"payin_extra_id"`
}

// CreatePayment 下单并返回链上收款地址与需要转账的精确金额。
func (n *NowPayments) CreatePayment(ctx context.Context, req payment.CreatePaymentRequest) (*payment.CreatePaymentResponse, error) {
	amount, err := decimal.NewFromString(strings.TrimSpace(req.Amount))
	if err != nil {
		return nil, fmt.Errorf("nowpayments invalid amount %q: %w", req.Amount, err)
	}
	priceAmount, _ := amount.Float64()

	payload := nowPaymentsCreateRequest{
		PriceAmount:      priceAmount,
		PriceCurrency:    n.currency(),
		PayCurrency:      n.config["payCurrency"],
		OrderID:          req.OrderID,
		OrderDescription: req.Subject,
		IPNCallbackURL:   req.NotifyURL,
	}

	var out nowPaymentsPayment
	if err := n.doJSON(ctx, http.MethodPost, "/payment", payload, &out); err != nil {
		return nil, fmt.Errorf("nowpayments create payment: %w", err)
	}
	if strings.TrimSpace(out.PayAddress) == "" || out.PaymentID.String() == "" {
		return nil, fmt.Errorf("nowpayments create payment: upstream returned no pay_address or payment_id")
	}

	return &payment.CreatePaymentResponse{
		TradeNo: out.PaymentID.String(),
		// 收款地址即二维码内容：钱包扫码得到地址，转账金额由页面单独展示。
		// 不拼 tron:...?amount= 这类 URI —— 各钱包解析规则不一致，扫出错误金额
		// 会造成少付，而少付在这条链路上无法自动退回。
		QRCode: out.PayAddress,
		// 精确到账数量必须回传给前端展示：用户只看到地址是付不对钱的。
		CryptoAmount:   out.PayAmount.String(),
		CryptoCurrency: strings.ToUpper(out.PayCurrency),
		Currency:       strings.ToUpper(out.PriceCurrency),
		ResultType:     payment.CreatePaymentResultOrderCreated,
	}, nil
}

// QueryOrder 主动查询支付状态，用于回调丢失时的兜底对账。
func (n *NowPayments) QueryOrder(ctx context.Context, tradeNo string) (*payment.QueryOrderResponse, error) {
	tradeNo = strings.TrimSpace(tradeNo)
	if tradeNo == "" {
		return nil, fmt.Errorf("nowpayments query order: empty trade no")
	}
	var out nowPaymentsPayment
	if err := n.doJSON(ctx, http.MethodGet, "/payment/"+url.PathEscape(tradeNo), nil, &out); err != nil {
		return nil, fmt.Errorf("nowpayments query order: %w", err)
	}

	priceAmount, _ := decimal.NewFromString(out.PriceAmount.String())
	amount, _ := priceAmount.Float64()

	return &payment.QueryOrderResponse{
		TradeNo:  out.PaymentID.String(),
		Status:   nowPaymentsProviderStatus(out.PaymentStatus),
		Amount:   amount,
		PaidAt:   normalizeNowPaymentsTimestamp(out.UpdatedAt),
		Metadata: n.paymentMetadata(out),
	}, nil
}

// VerifyNotification 校验并解析 IPN 回调。
//
// 签名规则（NOWPayments 官方）：对请求体 JSON 按 key 字母序递归排序后序列化，
// 用 ipnSecret 做 HMAC-SHA512，十六进制小写，放在 x-nowpayments-sig 头。
func (n *NowPayments) VerifyNotification(_ context.Context, rawBody string, headers map[string]string) (*payment.PaymentNotification, error) {
	if err := verifyNowPaymentsSignature(rawBody, headers, n.config["ipnSecret"]); err != nil {
		return nil, err
	}

	var out nowPaymentsPayment
	if err := json.Unmarshal([]byte(rawBody), &out); err != nil {
		return nil, fmt.Errorf("nowpayments parse notification: %w", err)
	}

	status := strings.ToLower(strings.TrimSpace(out.PaymentStatus))
	switch {
	case nowPaymentsSettled(status):
		// confirmed / sending / finished 都入账，理由见 nowPaymentsSettled。
	case status == nowPaymentsStatusFailed,
		status == nowPaymentsStatusExpired,
		status == nowPaymentsStatusRefunded:
		// 终态失败，通知上层关单。
	default:
		// waiting / confirming / partially_paid 都是中间态，返回 nil 让调用方
		// 回 200 并保持订单 pending。
		//
		// partially_paid 尤其要注意：用户确实付了钱但金额不足，既不能入账
		// 也不该关单，必须人工核对后处理。上游会在补足后继续推 confirmed。
		return nil, nil
	}

	priceAmount, _ := decimal.NewFromString(out.PriceAmount.String())
	amount, _ := priceAmount.Float64()

	notifyStatus := "failed"
	if nowPaymentsSettled(status) {
		notifyStatus = "success"
	}

	return &payment.PaymentNotification{
		TradeNo:  out.PaymentID.String(),
		OrderID:  out.OrderID,
		Amount:   amount,
		Status:   notifyStatus,
		RawData:  rawBody,
		Metadata: n.paymentMetadata(out),
	}, nil
}

// Refund 不被支持：链上转账不可逆，NOWPayments 的退款是人工发起的独立流程，
// 没有商户可调用的退款接口。返回明确错误好过静默假成功。
func (n *NowPayments) Refund(_ context.Context, _ payment.RefundRequest) (*payment.RefundResponse, error) {
	return nil, fmt.Errorf("nowpayments does not support programmatic refunds: on-chain transfers are irreversible, handle refunds manually in the NOWPayments dashboard")
}

func (n *NowPayments) paymentMetadata(p nowPaymentsPayment) map[string]string {
	meta := map[string]string{
		"provider":       payment.TypeNowPayments,
		"payment_status": p.PaymentStatus,
		"pay_currency":   p.PayCurrency,
		"pay_amount":     p.PayAmount.String(),
		"price_currency": p.PriceCurrency,
	}
	if addr := strings.TrimSpace(p.PayAddress); addr != "" {
		meta["pay_address"] = addr
	}
	if actually := strings.TrimSpace(p.ActuallyPaid.String()); actually != "" && actually != "0" {
		meta["actually_paid"] = actually
	}
	if id := strings.TrimSpace(p.PurchaseID); id != "" {
		meta["purchase_id"] = id
	}
	if extra := strings.TrimSpace(p.PayinExtraID); extra != "" {
		meta["payin_extra_id"] = extra
	}
	return meta
}

// nowPaymentsSettled 判定一个上游状态是否已经可以给用户入账。
//
// 只认 finished 是错的：finished 要等 NOWPayments 把钱从收款地址转到商户
// payout 钱包并在链上确认之后才置位。开了自动提现阈值的话，一笔小额订单会
// 停在 confirmed 直到攒够阈值——可能几小时，也可能几天，这期间用户看到的
// 一直是「待支付」。
//
// confirmed 已经意味着链上达到 NOWPayments 要求的确认数、资金计入商户余额，
// 此后回退只剩上游自身故障这一种可能，风险远低于让付过钱的用户干等。
// sending 是 confirmed 的后继态，一并放行。
func nowPaymentsSettled(status string) bool {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case nowPaymentsStatusConfirmed, nowPaymentsStatusSending, nowPaymentsStatusFinished:
		return true
	default:
		return false
	}
}

// nowPaymentsProviderStatus 把上游状态映射到框架的 pending/paid/failed/refunded。
func nowPaymentsProviderStatus(status string) string {
	status = strings.ToLower(strings.TrimSpace(status))
	if nowPaymentsSettled(status) {
		return "paid"
	}
	switch status {
	case nowPaymentsStatusFailed, nowPaymentsStatusExpired:
		return "failed"
	case nowPaymentsStatusRefunded:
		return "refunded"
	default:
		// waiting / confirming / partially_paid
		return "pending"
	}
}

func normalizeNowPaymentsTimestamp(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return ""
	}
	if ts, err := time.Parse(time.RFC3339, raw); err == nil {
		return ts.UTC().Format(time.RFC3339)
	}
	return raw
}

// verifyNowPaymentsSignature 复算 HMAC-SHA512 并做常数时间比较。
func verifyNowPaymentsSignature(rawBody string, headers map[string]string, secret string) error {
	secret = strings.TrimSpace(secret)
	if secret == "" {
		return fmt.Errorf("nowpayments ipnSecret not configured")
	}
	signature := strings.ToLower(strings.TrimSpace(headers["x-nowpayments-sig"]))
	if signature == "" {
		return fmt.Errorf("nowpayments notification missing x-nowpayments-sig header")
	}

	sorted, err := sortedCompactJSON(rawBody)
	if err != nil {
		return fmt.Errorf("nowpayments notification body: %w", err)
	}

	mac := hmac.New(sha512.New, []byte(secret))
	_, _ = mac.Write([]byte(sorted))
	expected := hex.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(expected), []byte(signature)) {
		return fmt.Errorf("nowpayments invalid signature")
	}
	return nil
}

// sortedCompactJSON 递归按 key 字母序重排 JSON 并紧凑序列化，复现上游签名时
// 使用的字符串。数字用 json.Number 原样保留，避免 1.0 被规范化成 1 导致签名不符。
func sortedCompactJSON(raw string) (string, error) {
	dec := json.NewDecoder(strings.NewReader(raw))
	dec.UseNumber()
	var v any
	if err := dec.Decode(&v); err != nil {
		return "", err
	}
	var buf bytes.Buffer
	if err := writeSortedJSON(&buf, v); err != nil {
		return "", err
	}
	return buf.String(), nil
}

// writeSortedJSON 按键排序序列化，用于复算 IPN 签名。
// bytes.Buffer 的 Write/WriteByte 文档保证返回的 error 恒为 nil（容量不足时直接 panic），
// 故此处统一显式丢弃；真正会失败的只有 json.Marshal，那些错误照常向上返回。
func writeSortedJSON(buf *bytes.Buffer, v any) error {
	switch t := v.(type) {
	case map[string]any:
		keys := make([]string, 0, len(t))
		for k := range t {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		_ = buf.WriteByte('{')
		for i, k := range keys {
			if i > 0 {
				_ = buf.WriteByte(',')
			}
			encoded, err := json.Marshal(k)
			if err != nil {
				return err
			}
			_, _ = buf.Write(encoded)
			_ = buf.WriteByte(':')
			if err := writeSortedJSON(buf, t[k]); err != nil {
				return err
			}
		}
		_ = buf.WriteByte('}')
		return nil
	case []any:
		_ = buf.WriteByte('[')
		for i, item := range t {
			if i > 0 {
				_ = buf.WriteByte(',')
			}
			if err := writeSortedJSON(buf, item); err != nil {
				return err
			}
		}
		_ = buf.WriteByte(']')
		return nil
	default:
		encoded, err := json.Marshal(v)
		if err != nil {
			return err
		}
		_, _ = buf.Write(encoded)
		return nil
	}
}

func (n *NowPayments) doJSON(ctx context.Context, method, path string, payload any, out any) error {
	var bodyReader io.Reader
	if payload != nil {
		body, err := json.Marshal(payload)
		if err != nil {
			return err
		}
		bodyReader = bytes.NewReader(body)
	}
	req, err := http.NewRequestWithContext(ctx, method, n.config["apiBase"]+path, bodyReader)
	if err != nil {
		return err
	}
	req.Header.Set("x-api-key", n.config["apiKey"])
	if payload != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	client := n.httpClient
	if client == nil {
		client = &http.Client{Timeout: nowPaymentsHTTPTimeout}
	}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()

	body, err := io.ReadAll(io.LimitReader(resp.Body, nowPaymentsMaxRespSize))
	if err != nil {
		return err
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("HTTP %d: %s", resp.StatusCode, summarizeNowPaymentsResponse(body))
	}
	if out == nil || len(bytes.TrimSpace(body)) == 0 {
		return nil
	}
	if err := json.Unmarshal(body, out); err != nil {
		return fmt.Errorf("parse response: %w", err)
	}
	return nil
}

func summarizeNowPaymentsResponse(body []byte) string {
	trimmed := strings.TrimSpace(string(body))
	if trimmed == "" {
		return "<empty response>"
	}
	// 上游错误体形如 {"statusCode":400,"code":"...","message":"..."}，优先取 message。
	var envelope struct {
		Message string `json:"message"`
		Code    string `json:"code"`
	}
	if err := json.Unmarshal(body, &envelope); err == nil {
		if msg := strings.TrimSpace(envelope.Message); msg != "" {
			if code := strings.TrimSpace(envelope.Code); code != "" {
				return truncateNowPaymentsDetail(code + ": " + msg)
			}
			return truncateNowPaymentsDetail(msg)
		}
	}
	return truncateNowPaymentsDetail(trimmed)
}

func truncateNowPaymentsDetail(s string) string {
	if len(s) <= nowPaymentsMaxErrDetail {
		return s
	}
	return s[:nowPaymentsMaxErrDetail] + "..."
}

// 确保接口实现完整。
var (
	_ payment.Provider                 = (*NowPayments)(nil)
	_ payment.MerchantIdentityProvider = (*NowPayments)(nil)
)
