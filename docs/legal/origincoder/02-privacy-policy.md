> Paste into 后台 → 设置 → 登录协议文档 → `privacy`（标题：Privacy Policy）.
> Every factual statement below was verified against the running system on 16 August 2026.
> If you change hosting, payment methods, retention settings or enable content screening, update this document.

# Privacy Policy

**Last updated:** 16 August 2026 · **Controller:** Fvawi Drein INC · **Contact:** support@origincoder.com

## 1. Summary

OriginCoder is an API gateway operated by Fvawi Drein INC ("we", "us"). This policy explains what personal data we collect when you use origincoder.com and our API, why we process it, and what control you have over it.

**The short version.** We collect the minimum needed to run an account and bill it: your email, your API keys, and a metered record of each request (model, token counts, cost, timestamp). We forward your prompts to the model provider you select so it can answer them. **We do not store the content of your prompts or the model's responses**, we do not use them to train models, and we do not sell your data.

## 2. What we collect

| Category | Details |
|---|---|
| **Account data** | Email address, hashed password, third-party sign-in identifier if you use one, optional display name. |
| **Billing data** | Plan, invoices, payment status, and the last four digits and brand of your card as reported by Stripe. **We never receive or store your full card number.** For USDT top-ups we store the on-chain transaction hash and the amount credited. |
| **Usage metadata** | Per API call: timestamp, model requested, upstream provider used, input and output token counts, computed cost, HTTP status code, and latency. **This record does not include the text of your request or the model's response.** |
| **Technical data** | IP address, user agent and request headers, used for security, abuse prevention and rate limiting. |
| **Support data** | Messages you send us by email, Telegram or Discord, and anything you choose to include in them. |

## 3. Prompts and model outputs

This is the part most users care about, so we state it precisely.

- Your prompt is **transmitted to the upstream model provider** you selected (for example Anthropic, OpenAI or Google) so that it can generate a response. That provider processes it under its own terms and privacy policy.
- **We do not persist the content of your requests or the model's responses.** Our metering record stores only the metadata listed in section 2.
- We **do not use your prompts or the model's outputs to train any model**, ours or anyone else's.
- We **do not sell** prompt content, and we do not share it with anyone other than the provider serving the request and the infrastructure vendors listed in section 5.
- **One exception, and it is narrow.** When an upstream provider returns an error, we store that provider's error response so we can diagnose the failure. Some providers echo a fragment of the offending request inside their error message. These diagnostic records are deleted after **30 days**.
- The platform includes an optional content-screening feature that, when an operator enables it, records prompt text for policy review. **This feature is disabled on origincoder.com.** If we ever enable it we will update this policy and notify account holders before it takes effect.

## 4. Why we process it

- **To provide the Service** — routing requests, enforcing rate limits, metering usage (performance of a contract).
- **To bill you** — issuing invoices, processing card and USDT payments, preventing payment fraud (contract and legal obligation).
- **To keep the platform secure** — detecting abuse, credential stuffing and denial-of-service attempts (legitimate interest).
- **To support you** — answering your messages and investigating incidents (contract and legitimate interest).
- **To comply with law** — tax records, sanctions screening and lawful requests from authorities (legal obligation).

## 5. Who we share it with

| Recipient | Purpose and data |
|---|---|
| **Model providers** | Anthropic, OpenAI, Google and other upstreams. They receive the content of requests routed to them, in order to answer them. |
| **Stripe, Inc.** | Card payment processing. Stripe receives your email and payment details directly; we receive only the result and card metadata. |
| **Vultr (The Constant Company, LLC)** | Hosting. Our servers and databases run in Vultr's Silicon Valley region (Santa Clara, California, United States). Vultr provides the infrastructure and does not process your data for its own purposes. |
| **Authorities** | Where required by valid legal process, or to protect rights, safety and property. |

We do not sell personal data, and we do not share it with advertisers.

## 6. How long we keep it

| Data | Retention |
|---|---|
| **Account data** | While your account is open, then deleted or anonymised within 90 days of closure. |
| **Usage metadata** | While your account is open, so you can reconcile bills. Purged on account closure, subject to the tax-record row below. |
| **Upstream error diagnostics** | 30 days, then deleted automatically. |
| **Administrative audit records** | 180 days. These record administrator actions on the platform, not user prompts. |
| **Channel health monitoring** | 30 days, in aggregate form only. |
| **Invoices and tax records** | For the period required by US tax law, typically 7 years. |

## 7. Security

Traffic to and from the Service is encrypted in transit with TLS. Passwords are stored using a one-way hash. API keys are shown once at creation and stored in a form that lets us verify but not display them again. Access to production systems is limited to personnel who need it.

No system is perfectly secure. If we become aware of a breach affecting your personal data, we will notify you and any competent authority as required by applicable law.

## 8. Your rights

Depending on where you live, you may have the right to access, correct, delete or export your personal data, to object to or restrict certain processing, and to withdraw consent. Residents of the EEA and the UK have these rights under the GDPR. Residents of California have rights under the CCPA/CPRA, including the right not to be discriminated against for exercising them.

To exercise any of these, email **support@origincoder.com** from your registered address. We will respond within 30 days. You may also lodge a complaint with your local data protection authority.

## 9. International transfers

We are based in the United States, our servers are located in California, and our upstream providers operate globally, so your data may be processed outside your country of residence. Where required, we rely on Standard Contractual Clauses or an equivalent transfer mechanism.

## 10. Cookies

We use **strictly necessary cookies only** — to keep you signed in and to protect against cross-site request forgery. **We do not use analytics, advertising or tracking cookies**, and we do not embed third-party analytics scripts. Because we set no non-essential cookies, no cookie consent banner is required.

## 11. Children

The Service is not directed to children under 18 and we do not knowingly collect their personal data. If you believe a child has provided us data, contact us and we will delete it.

## 12. Changes to this policy

If we change how we handle personal data in a way that materially affects you — for example by enabling content screening, adding a new category of stored data, or changing hosting region — we will give notice by email or in the dashboard at least 14 days before the change takes effect.

## 13. Contact

Fvawi Drein INC, 1942 Broadway Ste 314C, Boulder, CO 80302, United States — **support@origincoder.com**
