package service

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/pkg/httpclient"
)

// 购买成功群机器人推送：把充值 / 订阅购买成功事件以 Markdown 卡片推送到
// 企业微信、钉钉群机器人。两家机器人都是「拿到 webhook 就能发消息」的模型，
// 所以 URL 按凭据对待：只允许各自官方域名，杜绝把它改成内网地址做 SSRF。

const (
	WebhookPushChannelDingTalk = "dingtalk" // 钉钉
	WebhookPushChannelWeCom    = "wecom"    // 企业微信
)

// 推送事件标识与通知邮件保持同一套命名，便于两条链路对齐同一业务事件。
const (
	WebhookPushEventRechargeSuccess     = NotificationEmailEventBalanceRechargeSuccess
	WebhookPushEventSubscriptionSuccess = NotificationEmailEventSubscriptionPurchaseSuccess
)

const (
	dingTalkWebhookEndpoint = "https://oapi.dingtalk.com/robot/send"
	dingTalkWebhookHost     = "oapi.dingtalk.com"
	weComWebhookEndpoint    = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send"
	weComWebhookHost        = "qyapi.weixin.qq.com"

	webhookPushTimeout = 10 * time.Second
)

var (
	// ErrWebhookPushNotConfigured 表示该渠道没有配置可用的 webhook。
	ErrWebhookPushNotConfigured = errors.New("webhook push not configured")
	// ErrWebhookPushUnknownChannel 表示请求了不支持的推送渠道。
	ErrWebhookPushUnknownChannel = errors.New("unknown webhook push channel")
)

// WebhookPushSettings 群机器人推送配置。
type WebhookPushSettings struct {
	Enabled                    bool
	DingTalkURL                string
	DingTalkSecret             string
	WeComURL                   string
	RechargeSuccessEnabled     bool
	SubscriptionSuccessEnabled bool
	SiteName                   string
}

// configured 判断某渠道是否已填 webhook。
func (s WebhookPushSettings) configured(channel string) bool {
	switch channel {
	case WebhookPushChannelDingTalk:
		return strings.TrimSpace(s.DingTalkURL) != ""
	case WebhookPushChannelWeCom:
		return strings.TrimSpace(s.WeComURL) != ""
	default:
		return false
	}
}

// eventEnabled 判断事件级开关。
func (s WebhookPushSettings) eventEnabled(event string) bool {
	switch event {
	case WebhookPushEventRechargeSuccess:
		return s.RechargeSuccessEnabled
	case WebhookPushEventSubscriptionSuccess:
		return s.SubscriptionSuccessEnabled
	default:
		return false
	}
}

// WebhookPushService 购买成功群机器人推送服务。
type WebhookPushService struct {
	settingRepo SettingRepository
	httpClient  *http.Client
	now         func() time.Time
	// postMessage 是消息投递缝：默认发真实 HTTP 请求，测试可替换掉，
	// 这样域名白名单不必为测试放宽。
	postMessage func(ctx context.Context, endpoint string, payload any) error
}

// NewWebhookPushService 创建群机器人推送服务。
func NewWebhookPushService(settingRepo SettingRepository) *WebhookPushService {
	client, err := httpclient.GetClient(httpclient.Options{
		Timeout:            webhookPushTimeout,
		ValidateResolvedIP: true,
	})
	if err != nil {
		client = &http.Client{Timeout: webhookPushTimeout}
	}
	svc := &WebhookPushService{
		settingRepo: settingRepo,
		httpClient:  client,
		now:         time.Now,
	}
	svc.postMessage = svc.post
	return svc
}

// Settings 读取群机器人推送配置。
func (s *WebhookPushService) Settings(ctx context.Context) (WebhookPushSettings, error) {
	if s == nil || s.settingRepo == nil {
		return WebhookPushSettings{}, nil
	}
	values, err := s.settingRepo.GetMultiple(ctx, []string{
		SettingKeyPurchaseWebhookNotifyEnabled,
		SettingKeyPurchaseWebhookDingTalkURL,
		SettingKeyPurchaseWebhookDingTalkSecret,
		SettingKeyPurchaseWebhookWeComURL,
		SettingKeyPurchaseWebhookRechargeSuccessEnabled,
		SettingKeyPurchaseWebhookSubscriptionSuccessEnabled,
		SettingKeySiteName,
	})
	if err != nil {
		return WebhookPushSettings{}, fmt.Errorf("get webhook push settings: %w", err)
	}
	return WebhookPushSettings{
		Enabled:        values[SettingKeyPurchaseWebhookNotifyEnabled] == "true",
		DingTalkURL:    strings.TrimSpace(values[SettingKeyPurchaseWebhookDingTalkURL]),
		DingTalkSecret: strings.TrimSpace(values[SettingKeyPurchaseWebhookDingTalkSecret]),
		WeComURL:       strings.TrimSpace(values[SettingKeyPurchaseWebhookWeComURL]),
		// 事件开关缺省视为开启：总开关关着时它们没有意义，一旦管理员打开总开关，
		// 默认两个购买事件都推送，避免「配好了却什么都收不到」。
		RechargeSuccessEnabled:     !isFalseSettingValue(values[SettingKeyPurchaseWebhookRechargeSuccessEnabled]),
		SubscriptionSuccessEnabled: !isFalseSettingValue(values[SettingKeyPurchaseWebhookSubscriptionSuccessEnabled]),
		SiteName:                   strings.TrimSpace(values[SettingKeySiteName]),
	}, nil
}

// SendEvent 渲染并推送一个购买成功事件到所有已配置的群机器人。
// 总开关关闭、事件开关关闭或没有配置任何 webhook 时静默跳过。
func (s *WebhookPushService) SendEvent(ctx context.Context, event string, variables map[string]string) error {
	if s == nil {
		return nil
	}
	settings, err := s.Settings(ctx)
	if err != nil {
		return err
	}
	if !settings.Enabled || !settings.eventEnabled(event) {
		return nil
	}
	if !settings.configured(WebhookPushChannelDingTalk) && !settings.configured(WebhookPushChannelWeCom) {
		return nil
	}
	// 站点名来自设置，不由调用方传入。
	merged := make(map[string]string, len(variables)+1)
	for name, value := range variables {
		merged[name] = value
	}
	merged["site_name"] = settings.SiteName
	title, markdown, err := renderWebhookPushTemplate(event, merged, s.now())
	if err != nil {
		return err
	}
	return s.broadcast(ctx, settings, title, markdown)
}

// SendTest 向单个渠道推送一条测试消息，供管理端「测试推送」使用。
// 传入的 override 允许管理员在保存前先验证刚填的 webhook。
func (s *WebhookPushService) SendTest(ctx context.Context, channel string, override WebhookPushSettings) error {
	if s == nil {
		return ErrWebhookPushNotConfigured
	}
	settings, err := s.Settings(ctx)
	if err != nil {
		return err
	}
	if url := strings.TrimSpace(override.DingTalkURL); url != "" {
		settings.DingTalkURL = url
	}
	if secret := strings.TrimSpace(override.DingTalkSecret); secret != "" {
		settings.DingTalkSecret = secret
	}
	if url := strings.TrimSpace(override.WeComURL); url != "" {
		settings.WeComURL = url
	}
	if !settings.configured(channel) {
		return ErrWebhookPushNotConfigured
	}
	title, markdown := renderWebhookPushTestMessage(settings.SiteName, s.now())
	return s.send(ctx, channel, settings, title, markdown)
}

// broadcast 向所有已配置渠道推送，单渠道失败不影响其它渠道。
func (s *WebhookPushService) broadcast(ctx context.Context, settings WebhookPushSettings, title, markdown string) error {
	var errs []error
	for _, channel := range []string{WebhookPushChannelDingTalk, WebhookPushChannelWeCom} {
		if !settings.configured(channel) {
			continue
		}
		if err := s.send(ctx, channel, settings, title, markdown); err != nil {
			errs = append(errs, fmt.Errorf("%s: %w", channel, err))
		}
	}
	return errors.Join(errs...)
}

func (s *WebhookPushService) send(ctx context.Context, channel string, settings WebhookPushSettings, title, markdown string) error {
	var (
		endpoint string
		payload  any
		err      error
	)
	switch channel {
	case WebhookPushChannelDingTalk:
		endpoint, err = dingTalkRequestURL(settings.DingTalkURL, settings.DingTalkSecret, s.now())
		payload = dingTalkMarkdownPayload(title, markdown)
	case WebhookPushChannelWeCom:
		endpoint, err = weComRequestURL(settings.WeComURL)
		payload = weComMarkdownPayload(markdown)
	default:
		return ErrWebhookPushUnknownChannel
	}
	if err != nil {
		return err
	}
	if s.postMessage == nil {
		s.postMessage = s.post
	}
	return s.postMessage(ctx, endpoint, payload)
}

// webhookRobotResponse 钉钉与企业微信的机器人接口共用同一套错误结构。
type webhookRobotResponse struct {
	ErrCode int    `json:"errcode"`
	ErrMsg  string `json:"errmsg"`
}

func (s *WebhookPushService) post(ctx context.Context, endpoint string, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal webhook payload: %w", err)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("create webhook request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := s.httpClient
	if client == nil {
		client = &http.Client{Timeout: webhookPushTimeout}
	}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("send webhook request: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	raw, err := io.ReadAll(io.LimitReader(resp.Body, 8<<10))
	if err != nil {
		return fmt.Errorf("read webhook response: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("webhook responded with status %d: %s", resp.StatusCode, strings.TrimSpace(string(raw)))
	}
	var parsed webhookRobotResponse
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return fmt.Errorf("decode webhook response: %w", err)
	}
	if parsed.ErrCode != 0 {
		return fmt.Errorf("webhook rejected message: errcode=%d errmsg=%s", parsed.ErrCode, parsed.ErrMsg)
	}
	return nil
}

func dingTalkMarkdownPayload(title, markdown string) map[string]any {
	return map[string]any{
		"msgtype": "markdown",
		"markdown": map[string]string{
			"title": title,
			"text":  markdown,
		},
	}
}

func weComMarkdownPayload(markdown string) map[string]any {
	return map[string]any{
		"msgtype": "markdown",
		"markdown": map[string]string{
			"content": markdown,
		},
	}
}

// dingTalkRequestURL 归一化钉钉机器人地址，并在配置了加签密钥时附加签名。
// raw 允许直接填 access_token，也允许填控制台复制出来的完整 URL。
func dingTalkRequestURL(raw, secret string, now time.Time) (string, error) {
	parsed, err := normalizeWebhookURL(raw, dingTalkWebhookEndpoint, dingTalkWebhookHost, "access_token")
	if err != nil {
		return "", err
	}
	secret = strings.TrimSpace(secret)
	if secret == "" {
		return parsed.String(), nil
	}
	timestamp := strconv.FormatInt(now.UnixMilli(), 10)
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write([]byte(timestamp + "\n" + secret))
	query := parsed.Query()
	query.Set("timestamp", timestamp)
	query.Set("sign", base64.StdEncoding.EncodeToString(mac.Sum(nil)))
	parsed.RawQuery = query.Encode()
	return parsed.String(), nil
}

// weComRequestURL 归一化企业微信机器人地址；raw 允许直接填 key。
func weComRequestURL(raw string) (string, error) {
	parsed, err := normalizeWebhookURL(raw, weComWebhookEndpoint, weComWebhookHost, "key")
	if err != nil {
		return "", err
	}
	return parsed.String(), nil
}

// normalizeWebhookURL 把「完整 URL」或「裸 token」统一成官方 endpoint 上的请求地址。
// 只接受 https 且主机为官方域名：webhook 由管理员填写，限制域名可避免它被
// 改写成内网地址当作 SSRF 跳板。
func normalizeWebhookURL(raw, endpoint, host, tokenParam string) (*url.URL, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil, ErrWebhookPushNotConfigured
	}
	if !strings.Contains(raw, "://") {
		parsed, err := url.Parse(endpoint)
		if err != nil {
			return nil, fmt.Errorf("parse webhook endpoint: %w", err)
		}
		query := parsed.Query()
		query.Set(tokenParam, raw)
		parsed.RawQuery = query.Encode()
		return parsed, nil
	}
	parsed, err := url.Parse(raw)
	if err != nil {
		return nil, fmt.Errorf("parse webhook url: %w", err)
	}
	if parsed.Scheme != "https" {
		return nil, fmt.Errorf("webhook url must use https")
	}
	if !strings.EqualFold(parsed.Hostname(), host) {
		return nil, fmt.Errorf("webhook url host must be %s", host)
	}
	if strings.TrimSpace(parsed.Query().Get(tokenParam)) == "" {
		return nil, fmt.Errorf("webhook url must carry a %s parameter", tokenParam)
	}
	return parsed, nil
}
