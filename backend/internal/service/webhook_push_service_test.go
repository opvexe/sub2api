package service

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type webhookPushSettingRepoStub struct {
	SettingRepository // 嵌入接口，未实现的方法不应被调用

	mu     sync.Mutex
	values map[string]string
	err    error
}

func newWebhookPushSettingRepoStub(values map[string]string) *webhookPushSettingRepoStub {
	if values == nil {
		values = map[string]string{}
	}
	return &webhookPushSettingRepoStub{values: values}
}

func (r *webhookPushSettingRepoStub) GetMultiple(_ context.Context, keys []string) (map[string]string, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.err != nil {
		return nil, r.err
	}
	out := make(map[string]string, len(keys))
	for _, key := range keys {
		if value, ok := r.values[key]; ok {
			out[key] = value
		}
	}
	return out, nil
}

// capturedWebhookMessage 记录一次投递的目标地址与消息体。
type capturedWebhookMessage struct {
	endpoint string
	payload  map[string]any
}

// newTestWebhookPushService 替换投递缝，返回捕获到的消息列表。
func newTestWebhookPushService(repo SettingRepository, sendErr error) (*WebhookPushService, *[]capturedWebhookMessage) {
	svc := NewWebhookPushService(repo)
	svc.now = func() time.Time { return time.Date(2026, 3, 1, 10, 30, 0, 0, time.UTC) }
	var (
		mu       sync.Mutex
		captured []capturedWebhookMessage
	)
	svc.postMessage = func(_ context.Context, endpoint string, payload any) error {
		mu.Lock()
		defer mu.Unlock()
		body, _ := payload.(map[string]any)
		captured = append(captured, capturedWebhookMessage{endpoint: endpoint, payload: body})
		return sendErr
	}
	return svc, &captured
}

func markdownField(t *testing.T, message capturedWebhookMessage, field string) string {
	t.Helper()
	markdown, ok := message.payload["markdown"].(map[string]string)
	require.True(t, ok, "payload should carry a markdown object")
	return markdown[field]
}

func TestDingTalkRequestURLAcceptsBareToken(t *testing.T) {
	got, err := dingTalkRequestURL("abc123", "", time.Unix(0, 0))
	require.NoError(t, err)
	require.Equal(t, "https://oapi.dingtalk.com/robot/send?access_token=abc123", got)
}

func TestDingTalkRequestURLSignsWithSecret(t *testing.T) {
	now := time.UnixMilli(1_700_000_000_000)
	got, err := dingTalkRequestURL("https://oapi.dingtalk.com/robot/send?access_token=abc123", "SECRETVALUE", now)
	require.NoError(t, err)

	parsed, err := url.Parse(got)
	require.NoError(t, err)
	require.Equal(t, "1700000000000", parsed.Query().Get("timestamp"))
	require.Equal(t, "abc123", parsed.Query().Get("access_token"))

	mac := hmac.New(sha256.New, []byte("SECRETVALUE"))
	_, _ = mac.Write([]byte("1700000000000\nSECRETVALUE"))
	require.Equal(t, base64.StdEncoding.EncodeToString(mac.Sum(nil)), parsed.Query().Get("sign"))
}

func TestWebhookURLRejectsForeignHostAndScheme(t *testing.T) {
	// webhook 由管理员填写，禁止被改写成内网地址当作 SSRF 跳板。
	_, err := dingTalkRequestURL("https://internal.example.com/robot/send?access_token=abc", "", time.Unix(0, 0))
	require.ErrorContains(t, err, "host must be oapi.dingtalk.com")

	_, err = weComRequestURL("http://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abc")
	require.ErrorContains(t, err, "https")

	_, err = weComRequestURL("https://qyapi.weixin.qq.com/cgi-bin/webhook/send")
	require.ErrorContains(t, err, "key")
}

func TestWeComRequestURLAcceptsBareKey(t *testing.T) {
	got, err := weComRequestURL("07ff261a-e6b0")
	require.NoError(t, err)
	require.Equal(t, "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=07ff261a-e6b0", got)
}

func TestSendEventSkipsWhenDisabled(t *testing.T) {
	repo := newWebhookPushSettingRepoStub(map[string]string{
		SettingKeyPurchaseWebhookNotifyEnabled: "false",
		SettingKeyPurchaseWebhookWeComURL:      "key-value",
	})
	svc, captured := newTestWebhookPushService(repo, nil)

	require.NoError(t, svc.SendEvent(context.Background(), WebhookPushEventRechargeSuccess, map[string]string{}))
	require.Empty(t, *captured)
}

func TestSendEventSkipsWhenNoChannelConfigured(t *testing.T) {
	repo := newWebhookPushSettingRepoStub(map[string]string{
		SettingKeyPurchaseWebhookNotifyEnabled: "true",
	})
	svc, captured := newTestWebhookPushService(repo, nil)

	require.NoError(t, svc.SendEvent(context.Background(), WebhookPushEventRechargeSuccess, map[string]string{}))
	require.Empty(t, *captured)
}

func TestSendEventHonoursPerEventToggle(t *testing.T) {
	repo := newWebhookPushSettingRepoStub(map[string]string{
		SettingKeyPurchaseWebhookNotifyEnabled:          "true",
		SettingKeyPurchaseWebhookRechargeSuccessEnabled: "false",
		SettingKeyPurchaseWebhookWeComURL:               "key-value",
	})
	svc, captured := newTestWebhookPushService(repo, nil)

	require.NoError(t, svc.SendEvent(context.Background(), WebhookPushEventRechargeSuccess, map[string]string{}))
	require.Empty(t, *captured)

	// 订阅事件开关缺省视为开启，同一份配置下应当照常推送。
	require.NoError(t, svc.SendEvent(context.Background(), WebhookPushEventSubscriptionSuccess, map[string]string{
		"subscription_group": "Pro",
	}))
	require.Len(t, *captured, 1)
}

func TestSendEventDeliversToBothChannels(t *testing.T) {
	repo := newWebhookPushSettingRepoStub(map[string]string{
		SettingKeyPurchaseWebhookNotifyEnabled: "true",
		SettingKeyPurchaseWebhookDingTalkURL:   "token-value",
		SettingKeyPurchaseWebhookWeComURL:      "key-value",
		SettingKeySiteName:                     "OriginCoder",
	})
	svc, captured := newTestWebhookPushService(repo, nil)

	err := svc.SendEvent(context.Background(), WebhookPushEventRechargeSuccess, map[string]string{
		"recharge_amount": "10.00",
		"pay_amount":      "72.00 CNY",
		"user_name":       "alice",
		"order_no":        "sub2_20260301abcd",
	})
	require.NoError(t, err)
	require.Len(t, *captured, 2)

	dingTalk := (*captured)[0]
	require.Equal(t, "https://oapi.dingtalk.com/robot/send?access_token=token-value", dingTalk.endpoint)
	require.Equal(t, "OriginCoder - 余额充值成功", markdownField(t, dingTalk, "title"))
	require.Contains(t, markdownField(t, dingTalk, "text"), "sub2_20260301abcd")
	require.Contains(t, markdownField(t, dingTalk, "text"), "2026-03-01 10:30:00")

	weCom := (*captured)[1]
	require.Equal(t, "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=key-value", weCom.endpoint)
	require.Contains(t, markdownField(t, weCom, "content"), "余额充值成功通知")
	require.Contains(t, markdownField(t, weCom, "content"), "`72.00 CNY`")
}

func TestSendEventKeepsOtherChannelWhenOneFails(t *testing.T) {
	repo := newWebhookPushSettingRepoStub(map[string]string{
		SettingKeyPurchaseWebhookNotifyEnabled: "true",
		// 钉钉地址非法：企业微信仍应收到消息，错误一并返回。
		SettingKeyPurchaseWebhookDingTalkURL: "https://evil.example.com/robot/send?access_token=x",
		SettingKeyPurchaseWebhookWeComURL:    "key-value",
	})
	svc, captured := newTestWebhookPushService(repo, nil)

	err := svc.SendEvent(context.Background(), WebhookPushEventSubscriptionSuccess, map[string]string{})
	require.ErrorContains(t, err, "dingtalk")
	require.Len(t, *captured, 1)
	require.Contains(t, (*captured)[0].endpoint, "qyapi.weixin.qq.com")
}

func TestSendTestRequiresConfiguredChannel(t *testing.T) {
	svc, _ := newTestWebhookPushService(newWebhookPushSettingRepoStub(nil), nil)
	require.ErrorIs(t, svc.SendTest(context.Background(), WebhookPushChannelDingTalk, WebhookPushSettings{}), ErrWebhookPushNotConfigured)
}

func TestSendTestUsesOverrideURL(t *testing.T) {
	repo := newWebhookPushSettingRepoStub(map[string]string{SettingKeySiteName: "OriginCoder"})
	svc, captured := newTestWebhookPushService(repo, nil)

	// 管理员在保存前用刚填的地址试推一条。
	require.NoError(t, svc.SendTest(context.Background(), WebhookPushChannelWeCom, WebhookPushSettings{WeComURL: "fresh-key"}))
	require.Len(t, *captured, 1)
	require.Equal(t, "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=fresh-key", (*captured)[0].endpoint)
	content := markdownField(t, (*captured)[0], "content")
	require.Contains(t, content, "OriginCoder")
	require.Contains(t, content, "群机器人推送测试")
}

func TestPostSurfacesRobotErrCode(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"errcode":300001,"errmsg":"invalid webhook url"}`))
	}))
	defer server.Close()

	svc := NewWebhookPushService(newWebhookPushSettingRepoStub(nil))
	svc.httpClient = &http.Client{Timeout: 2 * time.Second}

	err := svc.post(context.Background(), server.URL, weComMarkdownPayload("hello"))
	require.ErrorContains(t, err, "errcode=300001")
	require.ErrorContains(t, err, "invalid webhook url")
}

func TestPostSurfacesHTTPStatus(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusBadGateway)
		_, _ = w.Write([]byte("upstream down"))
	}))
	defer server.Close()

	svc := NewWebhookPushService(newWebhookPushSettingRepoStub(nil))
	svc.httpClient = &http.Client{Timeout: 2 * time.Second}

	err := svc.post(context.Background(), server.URL, weComMarkdownPayload("hello"))
	require.ErrorContains(t, err, "status 502")
}

func TestPostAcceptsSuccessResponse(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		require.Equal(t, "application/json", r.Header.Get("Content-Type"))
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"errcode":0,"errmsg":"ok"}`))
	}))
	defer server.Close()

	svc := NewWebhookPushService(newWebhookPushSettingRepoStub(nil))
	svc.httpClient = &http.Client{Timeout: 2 * time.Second}

	require.NoError(t, svc.post(context.Background(), server.URL, dingTalkMarkdownPayload("t", "hello")))
}

func TestRenderWebhookPushTemplateFillsMissingValues(t *testing.T) {
	now := time.Date(2026, 3, 1, 10, 30, 0, 0, time.UTC)
	title, body, err := renderWebhookPushTemplate(WebhookPushEventSubscriptionSuccess, map[string]string{
		"subscription_group": "Pro",
		"user_name":          "line1\nline2",
	}, now)
	require.NoError(t, err)
	require.Equal(t, "OriginCoder - 订阅购买成功", title)
	require.Contains(t, body, "`Pro`")
	// 用户输入里的换行会打乱卡片排版，必须被压平。
	require.Contains(t, body, "`line1 line2`")
	// 未提供的字段渲染为 "-"，不留下空的行内代码块。
	require.Contains(t, body, "**到期时间**: `-`")
	require.False(t, strings.Contains(body, "{{"))
}

func TestRenderWebhookPushTemplateRejectsUnknownEvent(t *testing.T) {
	_, _, err := renderWebhookPushTemplate("nope", nil, time.Now())
	require.ErrorContains(t, err, "unsupported webhook push event")
}
