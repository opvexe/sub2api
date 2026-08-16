import { sanitizeUrl } from '@/utils/url'

export const DEFAULT_SITE_NAME = 'OriginCoder'
export const SITE_DOMAIN = 'origincoder.com'
export const SITE_ORIGIN = `https://${SITE_DOMAIN}`

// 历史品牌名：数据库里可能仍存着上游默认值或上一次改名的结果，统一收敛到当前品牌。
const LEGACY_DEFAULT_SITE_NAMES = ['Sub2API', 'LLM Provider']

export function normalizeSiteName(siteName?: string | null): string {
  const normalized = siteName?.trim() || ''
  return !normalized || LEGACY_DEFAULT_SITE_NAMES.includes(normalized)
    ? DEFAULT_SITE_NAME
    : normalized
}

// 首页标题：搜索结果里要展示「品牌 + 定位」，而不是路由名（Home - 品牌）。
// 与 index.html 的静态 <title> 和后端 injectSiteTitle 保持一致。
export const HOME_TITLE_SUFFIX = 'AI API Gateway'

// 默认品牌用关键词前置的标题（搜索词在前、品牌收尾），与 index.html 的静态 <title> 一致；
// 自建实例改名后没有这些关键词的立场，回落到「品牌 - 定位」。
export const DEFAULT_HOME_TITLE = 'Claude Code, Codex & GPT API — AI Gateway | OriginCoder'

export function resolveHomeTitle(siteName?: string | null): string {
  const name = normalizeSiteName(siteName)
  return name === DEFAULT_SITE_NAME ? DEFAULT_HOME_TITLE : `${name} - ${HOME_TITLE_SUFFIX}`
}

export function updateFavicon(logoUrl: string): void {
  const sanitizedLogoUrl = sanitizeUrl(logoUrl, {
    allowRelative: true,
    allowDataUrl: true,
  })
  if (!sanitizedLogoUrl) {
    return
  }

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.type = sanitizedLogoUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/x-icon'
  link.href = sanitizedLogoUrl
}
