> **Draft — needs legal review before publishing.**
> Paste into 后台 → 设置 → 登录协议文档 → `privacy`（标题：隐私政策）。
> Blocks marked ⚠️ **待确认** contain facts only you can supply — do not publish them as-is.


# Privacy Policy

**Last updated:** 15 August 2026 · **Controller:** Fvawi Drein INC · **Contact:** support@origincoder.com

## 1. Summary

OriginCoder is an API gateway operated by Fvawi Drein INC. This policy explains what personal data we collect, why, and what control you have.

**The short version.** We collect the minimum needed to run an account and bill it: your email, your API keys, and a metered record of each request (model, token counts, cost, timestamp). We forward your prompts to the model provider you select so it can answer them. **We do not use your prompts or outputs to train models**, and we do not sell your data.

## 2. What we collect

| Category | Details |
|---|---|
| **Account data** | Email address, hashed password, third-party sign-in identifier, optional display name. |
| **Billing data** | Plan, invoices, payment status, and the last four digits and brand of your card as reported by Stripe. **We never receive or store your full card number.** For USDT top-ups we store the transaction hash and amount credited. |
| **Usage metadata** | Per API call: timestamp, model requested, upstream provider used, input/output token counts, computed cost, HTTP status, latency. |
| **Technical data** | IP address, user agent and request headers — used for security, abuse prevention and rate limiting. |
| **Support data** | Messages you send us by email, Telegram or Discord. |

## 3. Prompts and model outputs

- Your prompt is **transmitted to the upstream model provider** you selected so it can generate a response. That provider processes it under its own terms and privacy policy.
- We **do not use your prompts or the model's outputs to train any model**, ours or anyone else's.
- We **do not sell** prompt content and do not share it beyond the provider serving the request and the infrastructure vendors listed below.

> ⚠️ **待确认** —— 是否留存请求体/响应体用于排障？留存多久（例如 24 小时 / 不留存）？这条对企业客户是决定性的，必须写准。

## 4. Why we process it

- **To provide the Service** — routing, rate limiting, metering (performance of a contract).
- **To bill you** — invoices, card and crypto payments, fraud prevention (contract and legal obligation).
- **To keep the platform secure** — abuse, credential stuffing and DoS detection (legitimate interest).
- **To support you** — answering messages, investigating incidents (contract and legitimate interest).
- **To comply with law** — tax records, sanctions screening, lawful requests (legal obligation).

## 5. Who we share it with

| Recipient | Purpose |
|---|---|
| **Model providers** | Anthropic, OpenAI, Google and other upstreams — receive the prompt content of requests routed to them. |
| **Stripe, Inc.** | Card payment processing. Receives your email and payment details directly; we receive only the result and card metadata. |
| **Hosting and infrastructure** | Servers, databases and CDN used to operate the Service. |
| **Authorities** | Where required by valid legal process, or to protect rights, safety and property. |

> ⚠️ **待确认** —— 实际使用的云厂商与数据所在区域。

We do not sell personal data and do not share it with advertisers.

## 6. How long we keep it

- **Account data** — while your account is open, then deleted or anonymised within 90 days of closure.
- **Invoices and tax records** — for the period required by US tax law, typically 7 years.

> ⚠️ **待确认** —— 用量元数据保留多久（例如 12 个月）？安全日志保留多久（例如 90 天）？

## 7. Security

Traffic is encrypted in transit with TLS. Passwords are stored using a one-way hash. API keys are shown once at creation and stored so we can verify but not display them again. Access to production systems is limited to personnel who need it.

No system is perfectly secure. If we become aware of a breach affecting your personal data we will notify you and any competent authority as required by law.

## 8. Your rights

Depending on where you live you may have the right to access, correct, delete or export your personal data, to object to or restrict processing, and to withdraw consent. EEA/UK residents have these rights under the GDPR; California residents under the CCPA/CPRA, including the right not to be discriminated against for exercising them.

Email support@origincoder.com from your registered address. We respond within 30 days. You may also complain to your local data protection authority.

## 9. International transfers

We are based in the United States and our upstream providers operate globally, so your data may be processed outside your country of residence. Where required we rely on Standard Contractual Clauses or an equivalent mechanism.

## 10. Cookies

We use strictly necessary cookies to keep you signed in and to protect against cross-site request forgery.

> ⚠️ **待确认** —— 是否使用分析工具（Google Analytics / Plausible 等）？用了必须在此列明，并按地区提供同意选项。

## 11. Children

The Service is not directed to children under 18 and we do not knowingly collect their personal data.

## 12. Contact

Fvawi Drein INC, 1942 Broadway Ste 314C, Boulder, CO 80302, United States — support@origincoder.com

---

# 隐私政策

**最后更新：** 2026 年 8 月 15 日 · **数据控制者：** Fvawi Drein INC · **联系方式：** support@origincoder.com

## 1. 摘要

OriginCoder 是由 Fvawi Drein INC 运营的 API 网关。本政策说明我们收集哪些个人数据、为何收集，以及您拥有哪些控制权。

**简短版本。** 我们只收集运行账号与计费所必需的信息：您的邮箱、API 密钥，以及每次请求的计量记录（模型、token 数、费用、时间戳）。我们会把您的提示词转发给您选择的模型服务商以便其作答。**我们不将您的提示词或输出用于训练模型**，也不出售您的数据。

## 2. 我们收集什么

| 类别 | 具体内容 |
|---|---|
| **账号数据** | 邮箱地址、密码哈希、第三方登录标识、可选显示名。 |
| **计费数据** | 套餐、发票、支付状态，以及 Stripe 返回的卡号后四位与卡组织。**我们不接触也不存储完整卡号。** USDT 充值则存储交易哈希与到账金额。 |
| **用量元数据** | 每次调用的时间戳、请求模型、实际使用的上游、输入/输出 token 数、计算得出的费用、HTTP 状态与延迟。 |
| **技术数据** | IP 地址、User-Agent 与请求头 —— 用于安全防护、滥用识别与限流。 |
| **支持数据** | 您通过邮件、Telegram 或 Discord 发送给我们的消息。 |

## 3. 提示词与模型输出

- 您的提示词会被**传输给您选择的上游模型服务商**以生成响应。该服务商依其自身条款与隐私政策处理。
- 我们**不将您的提示词或模型输出用于训练任何模型**，无论是我们的还是他人的。
- 我们**不出售**提示词内容，除为您的请求提供服务的上游服务商与下列基础设施供应商外，不与第三方共享。

> ⚠️ **待确认** —— 是否留存请求体/响应体用于排障？留存多久？这条必须写准。

## 4. 处理目的

- **提供服务** —— 路由、限流、计量（履行合同）。
- **计费** —— 开具发票、处理卡与加密货币支付、防范支付欺诈（合同与法定义务）。
- **保障平台安全** —— 识别滥用、撞库与拒绝服务攻击（正当利益）。
- **提供支持** —— 回复消息、排查故障（合同与正当利益）。
- **遵守法律** —— 税务记录、制裁名单筛查、合法调取（法定义务）。

## 5. 共享对象

| 接收方 | 用途 |
|---|---|
| **模型服务商** | Anthropic、OpenAI、Google 等上游 —— 接收路由至其的请求内容。 |
| **Stripe, Inc.** | 卡支付处理。直接接收您的邮箱与支付信息；我们只获得结果与卡片元数据。 |
| **托管与基础设施** | 运行本服务所用的服务器、数据库与 CDN。 |
| **主管机关** | 依有效法律程序要求，或为保护权利、安全与财产。 |

> ⚠️ **待确认** —— 实际使用的云厂商与数据所在区域。

我们不出售个人数据，也不与广告商共享。

## 6. 保留期限

- **账号数据** —— 账号存续期间保留，注销后 90 天内删除或匿名化。
- **发票与税务记录** —— 按美国税法要求保留，通常为 7 年。

> ⚠️ **待确认** —— 用量元数据与安全日志各保留多久？

## 7. 安全

传输链路使用 TLS 加密。密码以单向哈希存储。API 密钥仅在创建时显示一次，之后以可校验但不可回显的形式存储。生产系统访问权限仅限必要人员。

没有系统是绝对安全的。若发生影响您个人数据的安全事件，我们将依法通知您及主管机关。

## 8. 您的权利

根据您所在地区，您可能有权访问、更正、删除或导出您的个人数据，反对或限制处理，以及撤回同意。欧洲经济区/英国居民依 GDPR 享有这些权利；加州居民依 CCPA/CPRA 享有相应权利，包括不因行使权利而受歧视。

请从注册邮箱发送邮件至 support@origincoder.com，我们将在 30 天内回复。您也可向当地数据保护机构投诉。

## 9. 跨境传输

我们位于美国，上游服务商在全球运营，因此您的数据可能在您居住国之外被处理。在法律要求时，我们采用标准合同条款或等效机制。

## 10. Cookie

我们仅使用维持登录状态与防范跨站请求伪造所必需的 Cookie。

> ⚠️ **待确认** —— 是否使用分析工具？用了必须列明并按地区提供同意选项。

## 11. 未成年人

本服务不面向 18 周岁以下人士，我们不会在知情的情况下收集其个人数据。

## 12. 联系方式

Fvawi Drein INC, 1942 Broadway Ste 314C, Boulder, CO 80302, United States —— support@origincoder.com

