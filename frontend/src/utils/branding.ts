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
