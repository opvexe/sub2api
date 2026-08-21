export const DEFAULT_PAYMENT_CURRENCY = 'CNY'

const PAYMENT_CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  CNY: '¥',
  RMB: '¥',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  HKD: 'HK$',
  TWD: 'NT$',
  KRW: '₩',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  NZD: 'NZ$',
  MOP: 'MOP$',
  MYR: 'RM',
  THB: '฿',
  PHP: '₱',
  INR: '₹',
}

export function normalizePaymentCurrency(currency?: string | null): string {
  const normalized = String(currency || '').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(normalized) ? normalized : DEFAULT_PAYMENT_CURRENCY
}

export function currencySymbol(currency?: string | null): string {
  const normalized = normalizePaymentCurrency(currency)
  return PAYMENT_CURRENCY_SYMBOLS[normalized] || normalized
}

/**
 * Fraction digits the gateway charges in for a currency: 2 for most, 0 for
 * JPY/KRW/VND…, 3 for KWD/BHD/JOD…. Mirrors the backend's
 * payment.CurrencyMaxFractionDigits — every amount shown to the user must be
 * rounded with this, never with a hardcoded 2.
 */
export function paymentCurrencyFractionDigits(currency?: string | null): number {
  const normalized = normalizePaymentCurrency(currency)
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: normalized,
    }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {
    return 2
  }
}

/** Round to the currency's fraction digits (backend: decimal.StringFixed). */
export function roundPaymentAmount(value: number, currency?: string | null): number {
  if (!Number.isFinite(value)) return 0
  const factor = 10 ** paymentCurrencyFractionDigits(currency)
  return Math.round(value * factor) / factor
}

/** Round up to the currency's fraction digits (backend: decimal.RoundUp). */
export function ceilPaymentAmount(value: number, currency?: string | null): number {
  if (!Number.isFinite(value)) return 0
  const factor = 10 ** paymentCurrencyFractionDigits(currency)
  return Math.ceil(value * factor) / factor
}

export function formatPaymentAmount(amount: number, currency?: string | null, locale?: string): string {
  const normalized = normalizePaymentCurrency(currency)
  const fractionDigits = paymentCurrencyFractionDigits(normalized)
  try {
    return new Intl.NumberFormat(locale || undefined, {
      style: 'currency',
      currency: normalized,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(Number.isFinite(amount) ? amount : 0)
  } catch {
    return `${normalized} ${(Number.isFinite(amount) ? amount : 0).toFixed(fractionDigits)}`
  }
}
