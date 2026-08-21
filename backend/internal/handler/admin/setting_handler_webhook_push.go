package admin

import (
	"errors"
	"strings"

	"github.com/Wei-Shaw/sub2api/internal/pkg/response"
	"github.com/Wei-Shaw/sub2api/internal/service"

	"github.com/gin-gonic/gin"
)

// TestWebhookPushRequest 测试群机器人推送请求。
// URL / 密钥留空时回退到已保存的配置，便于管理员先保存再测试。
type TestWebhookPushRequest struct {
	Channel        string `json:"channel"`
	DingTalkURL    string `json:"purchase_webhook_dingtalk_url"`
	DingTalkSecret string `json:"purchase_webhook_dingtalk_secret"`
	WeComURL       string `json:"purchase_webhook_wecom_url"`
}

// TestWebhookPush 向企业微信 / 钉钉群机器人发送一条测试消息
// POST /api/v1/admin/settings/test-webhook-push
func (h *SettingHandler) TestWebhookPush(c *gin.Context) {
	var req TestWebhookPushRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request: "+err.Error())
		return
	}
	channel := strings.ToLower(strings.TrimSpace(req.Channel))
	if channel != service.WebhookPushChannelDingTalk && channel != service.WebhookPushChannelWeCom {
		response.BadRequest(c, "channel must be dingtalk or wecom")
		return
	}
	if h.webhookPushService == nil {
		response.InternalError(c, "Webhook push service unavailable")
		return
	}
	err := h.webhookPushService.SendTest(c.Request.Context(), channel, service.WebhookPushSettings{
		DingTalkURL:    req.DingTalkURL,
		DingTalkSecret: req.DingTalkSecret,
		WeComURL:       req.WeComURL,
	})
	if errors.Is(err, service.ErrWebhookPushNotConfigured) {
		response.BadRequest(c, "Webhook URL is required for the selected channel")
		return
	}
	if err != nil {
		response.BadRequest(c, "Webhook push test failed: "+err.Error())
		return
	}
	response.Success(c, gin.H{"message": "Webhook push sent"})
}
