import { DEFAULT_SITE_NAME, SITE_ORIGIN } from '@/utils/branding'
import { sanitizeUrl } from '@/utils/url'

/**
 * 首页 SEO：index.html 里已经写死了一份静态的 meta / JSON-LD 供爬虫直接抓取，
 * 这里只在运行时按管理员配置的站点名覆盖，保证自建实例改名后描述与结构化数据一致。
 */
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
  const title = `${name} - AI API Gateway`
  const canonical = SITE_ORIGIN
  const logo = sanitizeUrl(logoUrl || '', { allowRelative: true }) || `${SITE_ORIGIN}/logo-v2.png`
  const absoluteLogo = logo.startsWith('http') ? logo : `${SITE_ORIGIN}${logo}`

  document.title = title

  upsertMeta('meta[name="description"]', 'name', 'description', description)
  upsertMeta('meta[name="application-name"]', 'name', 'application-name', name)
  upsertMeta('meta[name="author"]', 'name', 'author', name)
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', title)
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', description)
  upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', name)
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', absoluteLogo)
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteLogo)
  upsertLink('canonical', canonical)

  upsertJsonLd('organization', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: canonical,
    logo: absoluteLogo,
    description,
  })
  upsertJsonLd('website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: canonical,
    description,
    inLanguage: document.documentElement.lang || 'zh-CN',
  })
}
