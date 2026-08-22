package provider

import (
	"context"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/payment"
)

func newTestNowPayments(t *testing.T, apiBase string) *NowPayments {
	t.Helper()
	p, err := NewNowPayments("inst-1", map[string]string{
		"apiKey":      "test-api-key",
		"ipnSecret":   "test-ipn-secret",
		"payCurrency": "usdttrc20",
		"currency":    "USD",
		"apiBase":     apiBase,
	})
	if err != nil {
		t.Fatalf("NewNowPayments: %v", err)
	}
	return p
}

func TestNewNowPaymentsRequiresSecrets(t *testing.T) {
	base := map[string]string{"apiKey": "k", "ipnSecret": "s", "payCurrency": "usdttrc20", "currency": "USD"}
	for _, missing := range []string{"apiKey", "ipnSecret", "payCurrency"} {
		cfg := cloneStringMap(base)
		cfg[missing] = "   "
		if _, err := NewNowPayments("inst", cfg); err == nil {
			t.Fatalf("expected error when %s is blank", missing)
		}
	}
}

func TestNewNowPaymentsRejectsNonHTTPSAPIBase(t *testing.T) {
	_, err := NewNowPayments("inst", map[string]string{
		"apiKey": "k", "ipnSecret": "s", "payCurrency": "usdttrc20", "currency": "USD",
		"apiBase": "http://api.nowpayments.io/v1",
	})
	if err == nil {
		t.Fatal("expected non-https apiBase to be rejected")
	}
}

func TestNowPaymentsCreatePayment(t *testing.T) {
	var gotPath, gotAPIKey string
	var gotBody map[string]any

	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotPath = r.URL.Path
		gotAPIKey = r.Header.Get("x-api-key")
		_ = json.NewDecoder(r.Body).Decode(&gotBody)
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{
			"payment_id": 5524759814,
			"payment_status": "waiting",
			"pay_address": "TNDFkiSmBQorNFacb3735q8MnT29sn8BLn",
			"pay_amount": 10.372145,
			"pay_currency": "usdttrc20",
			"price_amount": 10,
			"price_currency": "usd",
			"order_id": "ORD-1"
		}`))
	}))
	defer srv.Close()

	p := newTestNowPayments(t, srv.URL)
	p.httpClient = srv.Client()

	resp, err := p.CreatePayment(context.Background(), payment.CreatePaymentRequest{
		OrderID:   "ORD-1",
		Amount:    "10.00",
		Subject:   "Balance top-up",
		NotifyURL: "https://origincoder.com/api/v1/payment/notify/nowpayments",
	})
	if err != nil {
		t.Fatalf("CreatePayment: %v", err)
	}

	if gotPath != "/payment" {
		t.Errorf("path = %q, want /payment", gotPath)
	}
	if gotAPIKey != "test-api-key" {
		t.Errorf("x-api-key = %q", gotAPIKey)
	}
	if gotBody["pay_currency"] != "usdttrc20" {
		t.Errorf("pay_currency = %v", gotBody["pay_currency"])
	}
	if gotBody["price_currency"] != "usd" {
		t.Errorf("price_currency = %v", gotBody["price_currency"])
	}
	if gotBody["ipn_callback_url"] == nil || gotBody["ipn_callback_url"] == "" {
		t.Error("ipn_callback_url must be forwarded, otherwise payments never confirm")
	}

	if resp.TradeNo != "5524759814" {
		t.Errorf("TradeNo = %q", resp.TradeNo)
	}
	// 二维码必须是纯地址：拼 amount 的 URI 各钱包解析不一致，少付无法自动退回。
	if resp.QRCode != "TNDFkiSmBQorNFacb3735q8MnT29sn8BLn" {
		t.Errorf("QRCode = %q, want the bare pay_address", resp.QRCode)
	}
	if resp.ResultType != payment.CreatePaymentResultOrderCreated {
		t.Errorf("ResultType = %q", resp.ResultType)
	}
	// 精确数量必须原样透传：字符串保精度，少付 0.000001 都不会自动入账。
	if resp.CryptoAmount != "10.372145" {
		t.Errorf("CryptoAmount = %q, want the exact pay_amount 10.372145", resp.CryptoAmount)
	}
	if resp.CryptoCurrency != "USDTTRC20" {
		t.Errorf("CryptoCurrency = %q", resp.CryptoCurrency)
	}
	// Currency 是法币计价币种，不能被链上币种占用。
	if resp.Currency != "USD" {
		t.Errorf("Currency = %q, want the fiat price currency USD", resp.Currency)
	}
}

func TestNowPaymentsCreatePaymentRejectsEmptyAddress(t *testing.T) {
	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		_, _ = w.Write([]byte(`{"payment_id":1,"payment_status":"waiting","pay_address":""}`))
	}))
	defer srv.Close()

	p := newTestNowPayments(t, srv.URL)
	p.httpClient = srv.Client()

	if _, err := p.CreatePayment(context.Background(), payment.CreatePaymentRequest{OrderID: "O", Amount: "1.00"}); err == nil {
		t.Fatal("expected error when upstream returns no pay_address")
	}
}

func TestNowPaymentsCreatePaymentSurfacesUpstreamError(t *testing.T) {
	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		_, _ = w.Write([]byte(`{"statusCode":400,"code":"AMOUNT_MINIMAL_ERROR","message":"amountFrom is less than minimal"}`))
	}))
	defer srv.Close()

	p := newTestNowPayments(t, srv.URL)
	p.httpClient = srv.Client()

	_, err := p.CreatePayment(context.Background(), payment.CreatePaymentRequest{OrderID: "O", Amount: "0.01"})
	if err == nil {
		t.Fatal("expected upstream 400 to surface as an error")
	}
	if !strings.Contains(err.Error(), "AMOUNT_MINIMAL_ERROR") || !strings.Contains(err.Error(), "minimal") {
		t.Errorf("error should carry the upstream code and message, got %v", err)
	}
}

func TestNowPaymentsQueryOrder(t *testing.T) {
	srv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/payment/5524759814" {
			t.Errorf("path = %q", r.URL.Path)
		}
		_, _ = w.Write([]byte(`{
			"payment_id": 5524759814,
			"payment_status": "finished",
			"pay_amount": 10.372145,
			"pay_currency": "usdttrc20",
			"price_amount": 10,
			"price_currency": "usd",
			"actually_paid": 10.372145,
			"order_id": "ORD-1",
			"updated_at": "2026-08-16T14:40:46Z"
		}`))
	}))
	defer srv.Close()

	p := newTestNowPayments(t, srv.URL)
	p.httpClient = srv.Client()

	got, err := p.QueryOrder(context.Background(), "5524759814")
	if err != nil {
		t.Fatalf("QueryOrder: %v", err)
	}
	if got.Status != "paid" {
		t.Errorf("Status = %q, want paid", got.Status)
	}
	// 金额必须是计价币种（USD）而不是链上数量，否则与订单金额对不上。
	if got.Amount != 10 {
		t.Errorf("Amount = %v, want the USD price amount 10", got.Amount)
	}
	if got.Metadata["actually_paid"] != "10.372145" {
		t.Errorf("actually_paid metadata = %q", got.Metadata["actually_paid"])
	}
}

func signNowPayments(t *testing.T, secret, body string) string {
	t.Helper()
	sorted, err := sortedCompactJSON(body)
	if err != nil {
		t.Fatalf("sortedCompactJSON: %v", err)
	}
	mac := hmac.New(sha512.New, []byte(secret))
	_, _ = mac.Write([]byte(sorted))
	return hex.EncodeToString(mac.Sum(nil))
}

func TestNowPaymentsVerifyNotificationFinished(t *testing.T) {
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")
	// 故意打乱 key 顺序：验签依赖递归排序，顺序不该影响结果。
	body := `{"price_currency":"usd","payment_status":"finished","order_id":"ORD-1","payment_id":5524759814,"price_amount":10,"pay_currency":"usdttrc20","actually_paid":10.37}`

	got, err := p.VerifyNotification(context.Background(), body, map[string]string{
		"x-nowpayments-sig": signNowPayments(t, "test-ipn-secret", body),
	})
	if err != nil {
		t.Fatalf("VerifyNotification: %v", err)
	}
	if got == nil {
		t.Fatal("finished notification must not be ignored")
	}
	if got.Status != "success" || got.OrderID != "ORD-1" || got.TradeNo != "5524759814" {
		t.Errorf("got %+v", got)
	}
	if got.Amount != 10 {
		t.Errorf("Amount = %v, want 10", got.Amount)
	}
}

func TestNowPaymentsVerifyNotificationRejectsBadSignature(t *testing.T) {
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")
	body := `{"payment_id":1,"payment_status":"finished","order_id":"O","price_amount":10}`

	for name, sig := range map[string]string{
		"wrong":   signNowPayments(t, "another-secret", body),
		"missing": "",
		"garbage": "deadbeef",
	} {
		t.Run(name, func(t *testing.T) {
			if _, err := p.VerifyNotification(context.Background(), body, map[string]string{"x-nowpayments-sig": sig}); err == nil {
				t.Fatal("expected signature verification to fail")
			}
		})
	}
}

func TestNowPaymentsVerifyNotificationTamperedBodyFails(t *testing.T) {
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")
	original := `{"payment_id":1,"payment_status":"finished","order_id":"O","price_amount":10}`
	sig := signNowPayments(t, "test-ipn-secret", original)
	// 攻击者把金额从 10 改成 1000，签名应当失配。
	tampered := `{"payment_id":1,"payment_status":"finished","order_id":"O","price_amount":1000}`

	if _, err := p.VerifyNotification(context.Background(), tampered, map[string]string{"x-nowpayments-sig": sig}); err == nil {
		t.Fatal("tampered body must fail verification")
	}
}

func TestNowPaymentsVerifyNotificationIntermediateStatusesIgnored(t *testing.T) {
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")

	for _, status := range []string{
		nowPaymentsStatusWaiting,
		nowPaymentsStatusConfirming,
		nowPaymentsStatusPartiallyPaid,
	} {
		t.Run(status, func(t *testing.T) {
			body := `{"payment_id":1,"payment_status":"` + status + `","order_id":"O","price_amount":10}`
			got, err := p.VerifyNotification(context.Background(), body, map[string]string{
				"x-nowpayments-sig": signNowPayments(t, "test-ipn-secret", body),
			})
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got != nil {
				t.Fatalf("status %q must not settle the order, got %+v", status, got)
			}
		})
	}
}

func TestNowPaymentsVerifyNotificationSettlesBeforePayout(t *testing.T) {
	// confirmed / sending 都要入账：finished 要等 NOWPayments 把钱转到商户
	// payout 钱包才置位，攒阈值的自动提现会把它拖上几小时甚至几天，期间用户
	// 已经付过钱却一直看到「待支付」。
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")

	for _, status := range []string{
		nowPaymentsStatusConfirmed,
		nowPaymentsStatusSending,
		nowPaymentsStatusFinished,
	} {
		t.Run(status, func(t *testing.T) {
			body := `{"payment_id":1,"payment_status":"` + status + `","order_id":"O","price_amount":10}`
			got, err := p.VerifyNotification(context.Background(), body, map[string]string{
				"x-nowpayments-sig": signNowPayments(t, "test-ipn-secret", body),
			})
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got == nil {
				t.Fatalf("status %q must settle the order", status)
			}
			if got.Status != "success" {
				t.Errorf("Status = %q, want success", got.Status)
			}
			if got.Amount != 10 {
				t.Errorf("Amount = %v, want the price_amount 10", got.Amount)
			}
		})
	}
}

func TestNowPaymentsVerifyNotificationTerminalFailures(t *testing.T) {
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")

	for _, status := range []string{nowPaymentsStatusFailed, nowPaymentsStatusExpired, nowPaymentsStatusRefunded} {
		t.Run(status, func(t *testing.T) {
			body := `{"payment_id":1,"payment_status":"` + status + `","order_id":"O","price_amount":10}`
			got, err := p.VerifyNotification(context.Background(), body, map[string]string{
				"x-nowpayments-sig": signNowPayments(t, "test-ipn-secret", body),
			})
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got == nil || got.Status != "failed" {
				t.Fatalf("status %q should report failure, got %+v", status, got)
			}
		})
	}
}

func TestSortedCompactJSONIsOrderIndependent(t *testing.T) {
	a := `{"b":2,"a":1,"c":{"z":1,"y":[3,{"n":1,"m":2}]}}`
	b := `{"c":{"y":[3,{"m":2,"n":1}],"z":1},"a":1,"b":2}`

	sa, err := sortedCompactJSON(a)
	if err != nil {
		t.Fatal(err)
	}
	sb, err := sortedCompactJSON(b)
	if err != nil {
		t.Fatal(err)
	}
	if sa != sb {
		t.Fatalf("sorted forms differ:\n  %s\n  %s", sa, sb)
	}
	// 数组顺序有意义，不能被排序。
	if !strings.Contains(sa, `[3,{"m":2,"n":1}]`) {
		t.Errorf("array order must be preserved, got %s", sa)
	}
}

func TestSortedCompactJSONPreservesNumberFormatting(t *testing.T) {
	// 上游签名时用的是原始字面量，10.0 被规范化成 10 会导致验签失败。
	got, err := sortedCompactJSON(`{"a":10.0,"b":1e2}`)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(got, "10.0") || !strings.Contains(got, "1e2") {
		t.Errorf("number literals must be preserved verbatim, got %s", got)
	}
}

func TestNowPaymentsRefundIsUnsupported(t *testing.T) {
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")
	if _, err := p.Refund(context.Background(), payment.RefundRequest{TradeNo: "1", Amount: "10.00"}); err == nil {
		t.Fatal("refund must fail loudly rather than silently succeed")
	}
}

func TestNowPaymentsProviderStatusMapping(t *testing.T) {
	cases := map[string]string{
		nowPaymentsStatusWaiting:       "pending",
		nowPaymentsStatusConfirming:    "pending",
		nowPaymentsStatusConfirmed:     "paid",
		nowPaymentsStatusSending:       "paid",
		nowPaymentsStatusPartiallyPaid: "pending",
		nowPaymentsStatusFinished:      "paid",
		nowPaymentsStatusFailed:        "failed",
		nowPaymentsStatusExpired:       "failed",
		nowPaymentsStatusRefunded:      "refunded",
		"UNKNOWN_FUTURE_STATUS":        "pending",
	}
	for in, want := range cases {
		if got := nowPaymentsProviderStatus(in); got != want {
			t.Errorf("nowPaymentsProviderStatus(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestNowPaymentsSupportedTypesAndIdentity(t *testing.T) {
	p := newTestNowPayments(t, "https://api.nowpayments.io/v1")
	if got := p.SupportedTypes(); len(got) != 1 || got[0] != payment.TypeNowPayments {
		t.Errorf("SupportedTypes = %v", got)
	}
	if p.ProviderKey() != payment.TypeNowPayments {
		t.Errorf("ProviderKey = %q", p.ProviderKey())
	}
	meta := p.MerchantIdentityMetadata()
	if meta["payCurrency"] != "usdttrc20" {
		t.Errorf("identity payCurrency = %q", meta["payCurrency"])
	}
	// 身份元数据绝不能带密钥。
	for k, v := range meta {
		if strings.Contains(strings.ToLower(k), "secret") || v == "test-ipn-secret" || v == "test-api-key" {
			t.Errorf("identity metadata leaked a secret: %s=%s", k, v)
		}
	}
}
