import { DEFAULT_PAYMENT_CURRENCY, ceilPaymentAmount, roundPaymentAmount } from './currency'
import type { OrderType } from '@/types/payment'

/**
 * The three amounts a checkout page shows for one order, all in the gateway's
 * currency: what the gateway is asked to collect, the service fee on top, and
 * the total actually charged.
 */
export interface CheckoutAmounts {
  /** Gateway base amount — plan price after USD→CNY conversion, or the raw top-up amount. */
  payment: number
  /** Service fee, rounded up like the backend does. 0 when no fee is configured. */
  fee: number
  /** payment + fee — what the user is actually charged. */
  total: number
}

export interface CheckoutAmountContext {
  currency?: string | null
  feeRate: number
  /** 1 USD = X CNY for subscriptions. 0 / unset keeps the plan price as-is. */
  subscriptionUsdToCnyRate?: number
}

/**
 * Gateway base amount for an order, mirroring the backend's
 * calculateCreateOrderPayAmountForOrderType: subscriptions convert USD→CNY when
 * an explicit rate is configured and the gateway settles in CNY; top-ups are
 * charged as entered.
 */
export function gatewayBaseAmount(
  amount: number,
  orderType: OrderType,
  context: CheckoutAmountContext,
): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0
  const rate = context.subscriptionUsdToCnyRate ?? 0
  const converts = orderType === 'subscription'
    && rate > 0
    && (context.currency || DEFAULT_PAYMENT_CURRENCY) === DEFAULT_PAYMENT_CURRENCY
  return roundPaymentAmount(converts ? amount * rate : amount, context.currency)
}

/**
 * Payment / fee / total for one order.
 *
 * Mirrors backend payment.CalculatePayAmountForCurrency: the fee rounds *up*,
 * the total rounds to nearest, and both use the gateway currency's fraction
 * digits — so a JPY gateway shows whole yen and a KWD gateway shows 3 decimals.
 * Both the top-up and the subscription tab go through here; keeping one
 * implementation is what stops the two from drifting apart again.
 */
export function checkoutAmounts(
  amount: number,
  orderType: OrderType,
  context: CheckoutAmountContext,
): CheckoutAmounts {
  const payment = gatewayBaseAmount(amount, orderType, context)
  if (!(context.feeRate > 0) || payment <= 0) {
    return { payment, fee: 0, total: payment }
  }
  const fee = ceilPaymentAmount((payment * context.feeRate) / 100, context.currency)
  return { payment, fee, total: roundPaymentAmount(payment + fee, context.currency) }
}
