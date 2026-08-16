import { DEFAULT_SITE_NAME, SITE_ORIGIN, resolveHomeTitle } from '@/utils/branding'
import { sanitizeUrl } from '@/utils/url'

/**
 * 首页 SEO：index.html 里已经写死了一份静态的 meta / JSON-LD 供爬虫直接抓取，
 * 这里只在运行时按管理员配置的站点名覆盖，保证自建实例改名后描述与结构化数据一致。
 */
const SUPPORT_EMAIL = 'support@origincoder.com'
const MIN_TOPUP_USD = '5'
const SOCIAL_PROFILES = ['https://t.me/origincoder998', 'https://discord.gg/2C6Qvd36pq']
const SOFTWARE_FEATURES = [
  'OpenAI-compatible endpoint',
  'Claude, GPT and Gemini request formats',
  'Claude Code and Codex support',
  'One-click CC-Switch import',
  'USD pay-as-you-go balance',
  'Subscription plans',
  'Streaming responses',
  'Per-request usage and billing records',
]

export interface HomeSeoOptions {
  siteName?: string
  description: string
  logoUrl?: string
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.rel = rel
    document.head.appendChild(link)
  }
  link.href = href
}

function upsertAlternate(hreflang: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${hreflang}"]`
  )
  if (!link) {
    link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    document.head.appendChild(link)
  }
  link.href = href
}

function upsertJsonLd(id: string, data: Record<string, unknown>): void {
  let script = document.head.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function applyHomeSeo({ siteName, description, logoUrl }: HomeSeoOptions): void {
  const name = siteName?.trim() || DEFAULT_SITE_NAME
  const title = resolveHomeTitle(name)
  const canonical = SITE_ORIGIN
  const customLogo = sanitizeUrl(logoUrl || '', { allowRelative: true })
  const logo = customLogo || `${SITE_ORIGIN}/logo-v2.png`
  const absoluteLogo = logo.startsWith('http') ? logo : `${SITE_ORIGIN}${logo}`
  // 社交卡片要 1200x630 的横图，方形 logo 会被裁；自建实例设了自定义 logo 时才退回用它。
  const socialImage = customLogo ? absoluteLogo : `${SITE_ORIGIN}/og-image.png`

  document.title = title

  upsertMeta('meta[name="description"]', 'name', 'description', description)
  upsertMeta('meta[name="application-name"]', 'name', 'application-name', name)
  upsertMeta('meta[name="author"]', 'name', 'author', name)
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
  upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', name)
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', socialImage)
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage)
  upsertLink('canonical', canonical)

  // 海外版同时服务中英文用户：og:locale 跟随当前语言，两种语言都声明 alternate。
  const lang = document.documentElement.lang || 'en'
  upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', lang.startsWith('zh') ? 'zh_CN' : 'en_US')
  upsertAlternate('en', canonical)
  upsertAlternate('zh-CN', canonical)
  upsertAlternate('x-default', canonical)

  // 三个节点靠 @id 互相引用，爬虫才会把它们当成同一个实体；覆盖时必须整套一起写，
  // 否则 index.html 里的 sameAs / contactPoint / @id 会被这里的精简版洗掉。
  const orgId = `${canonical}/#organization`
  const siteId = `${canonical}/#website`

  upsertJsonLd('organization', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId,
    name,
    url: canonical,
    logo: absoluteLogo,
    sameAs: SOCIAL_PROFILES,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SUPPORT_EMAIL,
      availableLanguage: ['en', 'zh-CN'],
    },
    description,
  })
  upsertJsonLd('website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteId,
    name,
    url: canonical,
    publisher: { '@id': orgId },
    description,
    inLanguage: ['en', 'zh-CN'],
  })
  upsertJsonLd('software', {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${canonical}/#software`,
    name,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url: canonical,
    image: absoluteLogo,
    publisher: { '@id': orgId },
    isPartOf: { '@id': siteId },
    description,
    featureList: SOFTWARE_FEATURES,
    offers: {
      '@type': 'Offer',
      // 最低充值额，不是套餐价：余额按请求扣费，这里给的是入门门槛。
      price: MIN_TOPUP_USD,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${canonical}/purchase`,
      description: 'Minimum top-up. Usage is billed per request from the USD balance.',
    },
  })
}
