//go:build unit

package admin

import (
	"net/http"
	"testing"

	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/stretchr/testify/require"
)

// 群机器人配置全是指针字段：只发一两个开关的部分载荷不能把 webhook 抹掉，
// 否则任意一次面板保存都会静默停掉购买成功推送。
func TestUpdateSettingsPartialPayloadKeepsPurchaseWebhookConfig(t *testing.T) {
	h, repo := newStepUpSwitchTestHandler(t, map[string]string{
		service.SettingKeyPurchaseWebhookNotifyEnabled:  "true",
		service.SettingKeyPurchaseWebhookDingTalkURL:    "dingtalk-token",
		service.SettingKeyPurchaseWebhookDingTalkSecret: "SECstored",
		service.SettingKeyPurchaseWebhookWeComURL:       "wecom-key",
	})

	rec := doUpdateSettings(t, h, map[string]any{"risk_control_enabled": true}, nil)
	require.Equal(t, http.StatusOK, rec.Code)

	require.Equal(t, "true", repo.values[service.SettingKeyPurchaseWebhookNotifyEnabled])
	require.Equal(t, "dingtalk-token", repo.values[service.SettingKeyPurchaseWebhookDingTalkURL])
	require.Equal(t, "SECstored", repo.values[service.SettingKeyPurchaseWebhookDingTalkSecret])
	require.Equal(t, "wecom-key", repo.values[service.SettingKeyPurchaseWebhookWeComURL])
}

func TestUpdateSettingsWritesPurchaseWebhookConfig(t *testing.T) {
	h, repo := newStepUpSwitchTestHandler(t, map[string]string{})

	rec := doUpdateSettings(t, h, map[string]any{
		"purchase_webhook_notify_enabled":               true,
		"purchase_webhook_dingtalk_url":                 "  dingtalk-token  ",
		"purchase_webhook_dingtalk_secret":              "SECnew",
		"purchase_webhook_wecom_url":                    "wecom-key",
		"purchase_webhook_recharge_success_enabled":     false,
		"purchase_webhook_subscription_success_enabled": true,
	}, nil)
	require.Equal(t, http.StatusOK, rec.Code)

	require.Equal(t, "true", repo.values[service.SettingKeyPurchaseWebhookNotifyEnabled])
	require.Equal(t, "dingtalk-token", repo.values[service.SettingKeyPurchaseWebhookDingTalkURL])
	require.Equal(t, "SECnew", repo.values[service.SettingKeyPurchaseWebhookDingTalkSecret])
	require.Equal(t, "wecom-key", repo.values[service.SettingKeyPurchaseWebhookWeComURL])
	require.Equal(t, "false", repo.values[service.SettingKeyPurchaseWebhookRechargeSuccessEnabled])
	require.Equal(t, "true", repo.values[service.SettingKeyPurchaseWebhookSubscriptionSuccessEnabled])
}

// 加签密钥不回显，前端未改动时会发空串：空串必须保留已存密钥。
func TestUpdateSettingsKeepsStoredDingTalkSecretWhenEmpty(t *testing.T) {
	h, repo := newStepUpSwitchTestHandler(t, map[string]string{
		service.SettingKeyPurchaseWebhookDingTalkURL:    "dingtalk-token",
		service.SettingKeyPurchaseWebhookDingTalkSecret: "SECstored",
	})

	rec := doUpdateSettings(t, h, map[string]any{
		"purchase_webhook_dingtalk_url":    "dingtalk-token-2",
		"purchase_webhook_dingtalk_secret": "",
	}, nil)
	require.Equal(t, http.StatusOK, rec.Code)

	require.Equal(t, "dingtalk-token-2", repo.values[service.SettingKeyPurchaseWebhookDingTalkURL])
	require.Equal(t, "SECstored", repo.values[service.SettingKeyPurchaseWebhookDingTalkSecret])
}

// 清空钉钉 webhook 视为下线该渠道，密钥一并清掉，否则「留空=保留」会让它永远删不掉。
func TestUpdateSettingsClearingDingTalkURLClearsSecret(t *testing.T) {
	h, repo := newStepUpSwitchTestHandler(t, map[string]string{
		service.SettingKeyPurchaseWebhookDingTalkURL:    "dingtalk-token",
		service.SettingKeyPurchaseWebhookDingTalkSecret: "SECstored",
	})

	rec := doUpdateSettings(t, h, map[string]any{
		"purchase_webhook_dingtalk_url":    "",
		"purchase_webhook_dingtalk_secret": "",
	}, nil)
	require.Equal(t, http.StatusOK, rec.Code)

	require.Equal(t, "", repo.values[service.SettingKeyPurchaseWebhookDingTalkURL])
	require.Equal(t, "", repo.values[service.SettingKeyPurchaseWebhookDingTalkSecret])
}
