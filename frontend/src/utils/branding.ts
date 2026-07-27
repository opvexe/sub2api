import { sanitizeUrl } from '@/utils/url'

export const DEFAULT_SITE_NAME = 'LLM Provider'

const LEGACY_DEFAULT_SITE_NAME = 'Sub2API'

export function normalizeSiteName(siteName?: string | null): string {
  const normalized = siteName?.trim() || ''
  return !normalized || normalized === LEGACY_DEFAULT_SITE_NAME
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
