package service

import (
	"fmt"
	"regexp"
	"strings"
	"time"
)

// 群机器人 Markdown 模板。钉钉与企业微信的 Markdown 子集不同，取两者的交集：
// 标题、加粗、无序列表、行内代码，其它一律不用，保证两边渲染一致。

const (
	webhookPushRechargeSuccessTitle     = "余额充值成功"
	webhookPushSubscriptionSuccessTitle = "订阅购买成功"
	webhookPushTestTitle                = "群机器人推送测试"

	// 站点名没配时的兜底：与前端 branding.ts 的品牌名保持一致，
	// 免得推送卡片露出上游默认名。
	webhookPushDefaultSiteName = "OriginCoder"
)

const webhookPushRechargeSuccessTemplate = "## **✅余额充值成功通知**\n" + `
---
#### **订单信息**

- **充值金额**: ` + "`{{recharge_amount}}`" + `
- **实付金额**: ` + "`{{pay_amount}}`" + `
- **支付方式**: ` + "`{{payment_type}}`" + `
- **订单号**: ` + "`{{order_no}}`" + `

---
#### **用户信息**

- **用户名**: ` + "`{{user_name}}`" + `
- **邮箱**: ` + "`{{user_email}}`" + `
- **用户ID**: ` + "`{{user_id}}`" + `
- **当前余额**: ` + "`{{current_balance}}`" + `

---

#### **✅充值成功**：用户已成功充值，请相关人员关注！

---
站点：` + "`{{site_name}}`" + ` ｜ 通知时间：` + "`{{notification_time}}`"

const webhookPushSubscriptionSuccessTemplate = "## **✅订阅购买成功通知**\n" + `
---
#### **订阅信息**

- **订阅分组**: ` + "`{{subscription_group}}`" + `
- **订阅时长**: ` + "`{{subscription_days}}`" + `
- **到期时间**: ` + "`{{expiry_time}}`" + `

---
#### **订单信息**

- **实付金额**: ` + "`{{pay_amount}}`" + `
- **支付方式**: ` + "`{{payment_type}}`" + `
- **订单号**: ` + "`{{order_no}}`" + `

---
#### **用户信息**

- **用户名**: ` + "`{{user_name}}`" + `
- **邮箱**: ` + "`{{user_email}}`" + `
- **用户ID**: ` + "`{{user_id}}`" + `

---

#### **✅购买成功**：用户已成功购买订阅，请相关人员关注！

---
站点：` + "`{{site_name}}`" + ` ｜ 通知时间：` + "`{{notification_time}}`"

const webhookPushTestTemplate = "## **🔔群机器人推送测试**\n" + `
---

这是一条来自 ` + "`{{site_name}}`" + ` 的测试消息，收到即表示购买成功推送配置可用。

---
通知时间：` + "`{{notification_time}}`"

var webhookPushPlaceholderPattern = regexp.MustCompile(`{{\s*([a-zA-Z][a-zA-Z0-9_]*)\s*}}`)

// webhookPushTemplates 事件 -> (标题, 模板)。
var webhookPushTemplates = map[string]struct {
	title string
	body  string
}{
	WebhookPushEventRechargeSuccess:     {title: webhookPushRechargeSuccessTitle, body: webhookPushRechargeSuccessTemplate},
	WebhookPushEventSubscriptionSuccess: {title: webhookPushSubscriptionSuccessTitle, body: webhookPushSubscriptionSuccessTemplate},
}

// renderWebhookPushTemplate 渲染事件模板，返回钉钉标题与 Markdown 正文。
func renderWebhookPushTemplate(event string, variables map[string]string, now time.Time) (string, string, error) {
	tmpl, ok := webhookPushTemplates[event]
	if !ok {
		return "", "", fmt.Errorf("unsupported webhook push event %s", event)
	}
	vars := webhookPushVariables(variables, now)
	return webhookPushTitle(vars["site_name"], tmpl.title), renderWebhookPushString(tmpl.body, vars), nil
}

// renderWebhookPushTestMessage 渲染管理端「测试推送」用的消息。
func renderWebhookPushTestMessage(siteName string, now time.Time) (string, string) {
	vars := webhookPushVariables(map[string]string{"site_name": siteName}, now)
	return webhookPushTitle(vars["site_name"], webhookPushTestTitle), renderWebhookPushString(webhookPushTestTemplate, vars)
}

// webhookPushVariables 补齐站点名与通知时间，并清洗所有取值。
func webhookPushVariables(variables map[string]string, now time.Time) map[string]string {
	vars := make(map[string]string, len(variables)+2)
	for name, value := range variables {
		vars[name] = sanitizeWebhookPushValue(value)
	}
	if vars["site_name"] == "" {
		vars["site_name"] = webhookPushDefaultSiteName
	}
	vars["notification_time"] = now.Format("2006-01-02 15:04:05")
	return vars
}

func webhookPushTitle(siteName, eventTitle string) string {
	if siteName == "" {
		return eventTitle
	}
	return siteName + " - " + eventTitle
}

// renderWebhookPushString 替换 {{name}} 占位符，未提供的占位符渲染为 "-"，
// 避免消息里出现空的行内代码块。
func renderWebhookPushString(raw string, variables map[string]string) string {
	return webhookPushPlaceholderPattern.ReplaceAllStringFunc(raw, func(match string) string {
		parts := webhookPushPlaceholderPattern.FindStringSubmatch(match)
		if len(parts) != 2 {
			return ""
		}
		if value := variables[parts[1]]; value != "" {
			return value
		}
		return "-"
	})
}

// sanitizeWebhookPushValue 去掉会破坏 Markdown 排版的字符：用户名、备注等
// 取值来自用户输入，反引号或换行会让整条卡片错位。
func sanitizeWebhookPushValue(value string) string {
	replaced := strings.NewReplacer("`", "'", "\r", " ", "\n", " ").Replace(value)
	return strings.TrimSpace(replaced)
}
