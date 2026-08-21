import { describe, expect, it } from 'vitest'
import { checkoutAmounts, gatewayBaseAmount } from '@/components/payment/checkoutAmounts'

describe('checkoutAmounts', () => {
  it('charges the entered amount when no fee is configured', () => {
    expect(checkoutAmounts(100, 'balance', { currency: 'CNY', feeRate: 0 })).toEqual({
      payment: 100,
      fee: 0,
      total: 100,
    })
  })

  it('rounds the fee up and the total to nearest, like the backend', () => {
    // 100 × 2.5% = 2.5 exactly; 99 × 2.5% = 2.475 → rounds up to 2.48
    expect(checkoutAmounts(99, 'balance', { currency: 'CNY', feeRate: 2.5 })).toEqual({
      payment: 99,
      fee: 2.48,
      total: 101.48,
    })
  })

  it.each([
    // 顶部回归锁：充值页曾把所有币种写死按 2 位小数取整，
    // 对 0 位（JPY）和 3 位（KWD）币种与后端 pay_amount 对不上。
    { currency: 'JPY', amount: 5000, feeRate: 2.5, expected: { payment: 5000, fee: 125, total: 5125 } },
    { currency: 'JPY', amount: 999, feeRate: 2.5, expected: { payment: 999, fee: 25, total: 1024 } },
    { currency: 'KWD', amount: 10, feeRate: 2.5, expected: { payment: 10, fee: 0.25, total: 10.25 } },
    { currency: 'KWD', amount: 9.999, feeRate: 1.1, expected: { payment: 9.999, fee: 0.11, total: 10.109 } },
  ])('uses $currency fraction digits for top-ups', ({ currency, amount, feeRate, expected }) => {
    expect(checkoutAmounts(amount, 'balance', { currency, feeRate })).toEqual(expected)
  })

  it('converts subscription prices to CNY before adding the fee', () => {
    expect(checkoutAmounts(9.99, 'subscription', {
      currency: 'CNY',
      feeRate: 2.5,
      subscriptionUsdToCnyRate: 7.15,
    })).toEqual({ payment: 71.43, fee: 1.79, total: 73.22 })
  })

  it('keeps the plan price when no subscription rate is configured', () => {
    expect(gatewayBaseAmount(7.99, 'subscription', { currency: 'CNY', feeRate: 0 })).toBe(7.99)
  })

  it('keeps the plan price when the gateway does not settle in CNY', () => {
    expect(gatewayBaseAmount(7.99, 'subscription', {
      currency: 'USD',
      feeRate: 0,
      subscriptionUsdToCnyRate: 7.15,
    })).toBe(7.99)
  })

  it('treats non-positive and non-finite amounts as zero', () => {
    for (const amount of [0, -5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(checkoutAmounts(amount, 'balance', { currency: 'CNY', feeRate: 2.5 })).toEqual({
        payment: 0,
        fee: 0,
        total: 0,
      })
    }
  })
})
