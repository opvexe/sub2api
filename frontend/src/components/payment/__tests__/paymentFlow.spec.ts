import { describe, expect, it } from 'vitest'
import type { CreateOrderResult, MethodLimit } from '@/types/payment'
import {
  buildCreateOrderPayload,
  buildPaymentRouteTargets,
  decidePaymentLaunch,
  getVisibleMethods,
  planPaymentLaunch,
  readPaymentRecoverySnapshot,
  stripeSubMethodFor,
  type PaymentRecoverySnapshot,
} from '@/components/payment/paymentFlow'

function methodLimit(overrides: Partial<MethodLimit> = {}): MethodLimit {
  return {
    daily_limit: 0,
    daily_used: 0,
    daily_remaining: 0,
    single_min: 0,
    single_max: 0,
    fee_rate: 0,
    available: true,
    ...overrides,
  }
}

function createOrderResult(overrides: Partial<CreateOrderResult> = {}): CreateOrderResult {
  return {
    order_id: 101,
    amount: 88,
    pay_amount: 88,
    fee_rate: 0,
    expires_at: '2099-01-01T00:10:00.000Z',
    ...overrides,
  }
}

describe('getVisibleMethods', () => {
  it('normalizes provider aliases and keeps stripe as a top-level method', () => {
    const visible = getVisibleMethods({
      alipay_direct: methodLimit({ single_min: 5 }),
      wxpay: methodLimit({ single_max: 100 }),
      stripe: methodLimit({ fee_rate: 3 }),
      airwallex: methodLimit({ single_min: 10 }),
    })

    expect(visible).toEqual({
      alipay: methodLimit({ single_min: 5 }),
      wxpay: methodLimit({ single_max: 100 }),
      stripe: methodLimit({ fee_rate: 3 }),
      airwallex: methodLimit({ single_min: 10 }),
    })
  })

  it('prefers canonical visible methods over aliases when both exist', () => {
    const visible = getVisibleMethods({
      alipay: methodLimit({ single_min: 2 }),
      alipay_direct: methodLimit({ single_min: 9 }),
      wxpay_direct: methodLimit({ fee_rate: 1.2 }),
    })

    expect(visible.alipay.single_min).toBe(2)
    expect(visible.wxpay.fee_rate).toBe(1.2)
  })

  it('keeps custom EasyPay methods as visible methods', () => {
    const visible = getVisibleMethods({
      ldc: methodLimit({ single_min: 3 }),
      usdt_trc20: methodLimit({ fee_rate: 1 }),
    })

    expect(visible).toEqual({
      ldc: methodLimit({ single_min: 3 }),
      usdt_trc20: methodLimit({ fee_rate: 1 }),
    })
  })
})

describe('decidePaymentLaunch', () => {
  it('uses Stripe popup waiting flow for desktop Alipay client secret', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      client_secret: 'cs_test',
      resume_token: 'resume-1',
    }), {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: false,
    })

    expect(decision.kind).toBe('stripe_popup')
    expect(decision.paymentState.paymentType).toBe('alipay')
    expect(decision.stripeMethod).toBe('alipay')
    expect(decision.recovery.resumeToken).toBe('resume-1')
    expect(decision.recovery.outTradeNo).toBe('')
  })

  it('routes Stripe button click to the full Payment Element without a preselected sub-method', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      client_secret: 'cs_test',
    }), {
      visibleMethod: 'stripe',
      orderType: 'balance',
      isMobile: false,
    })

    expect(decision.kind).toBe('stripe_route')
    expect(decision.stripeMethod).toBeUndefined()
  })

  it('uses Stripe route flow for mobile WeChat client secret', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      client_secret: 'cs_test',
    }), {
      visibleMethod: 'wxpay',
      orderType: 'subscription',
      isMobile: true,
    })

    expect(decision.kind).toBe('stripe_route')
    expect(decision.stripeMethod).toBe('wechat_pay')
    expect(decision.paymentState.orderType).toBe('subscription')
  })

  it('routes Airwallex client secrets through the hosted Airwallex page', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      client_secret: 'awx_cs',
      intent_id: 'int_awx',
      currency: 'CNY',
      country_code: 'CN',
      payment_env: 'demo',
      out_trade_no: 'sub2_awx',
    }), {
      visibleMethod: 'airwallex',
      orderType: 'balance',
      isMobile: false,
      airwallexRouteUrl: '/payment/airwallex?order_id=101',
    })

    expect(decision.kind).toBe('airwallex_route')
    expect(decision.paymentState.payUrl).toBe('/payment/airwallex?order_id=101')
    expect(decision.paymentState.intentId).toBe('int_awx')
    expect(decision.paymentState.currency).toBe('CNY')
    expect(decision.paymentState.countryCode).toBe('CN')
    expect(decision.paymentState.paymentEnv).toBe('demo')
  })

  it('keeps hosted redirect metadata for recovery flows', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      pay_url: 'https://pay.example.com/session/abc',
      payment_mode: 'popup',
      resume_token: 'resume-2',
      out_trade_no: 'sub2_abc',
    }), {
      visibleMethod: 'wxpay',
      orderType: 'balance',
      isMobile: false,
    })

    expect(decision.kind).toBe('redirect_waiting')
    expect(decision.paymentState.payUrl).toBe('https://pay.example.com/session/abc')
    expect(decision.recovery.paymentMode).toBe('popup')
    expect(decision.recovery.outTradeNo).toBe('sub2_abc')
    expect(decision.recovery.resumeToken).toBe('resume-2')
  })

  it('prefers redirect on mobile when both pay_url and qr_code are present', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      pay_url: 'https://pay.example.com/mobile/session',
      qr_code: 'https://pay.example.com/qr/session',
    }), {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: true,
    })

    expect(decision.kind).toBe('redirect_waiting')
    expect(decision.paymentState.payUrl).toBe('https://pay.example.com/mobile/session')
    expect(decision.paymentState.qrCode).toBe('https://pay.example.com/qr/session')
  })

  it('keeps QR flow on desktop when both pay_url and qr_code are present', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      pay_url: 'https://pay.example.com/desktop/session',
      qr_code: 'https://pay.example.com/qr/session',
    }), {
      visibleMethod: 'wxpay',
      orderType: 'balance',
      isMobile: false,
    })

    expect(decision.kind).toBe('qr_waiting')
    expect(decision.paymentState.qrCode).toBe('https://pay.example.com/qr/session')
  })

  it('returns wechat oauth launch when backend requires in-app authorization', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      result_type: 'oauth_required',
      payment_type: 'wxpay',
      oauth: {
        authorize_url: '/api/v1/auth/oauth/wechat/payment/start?payment_type=wxpay',
        appid: 'wx123',
        scope: 'snsapi_base',
        redirect_url: '/auth/wechat/payment/callback',
      },
    }), {
      visibleMethod: 'wxpay',
      orderType: 'balance',
      isMobile: true,
    })

    expect(decision.kind).toBe('wechat_oauth')
    expect(decision.oauth?.authorize_url).toContain('/api/v1/auth/oauth/wechat/payment/start')
    expect(decision.paymentState.paymentType).toBe('wxpay')
  })

  it('returns wechat jsapi launch when backend has a jsapi payload ready', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      result_type: 'jsapi_ready',
      payment_type: 'wxpay',
      jsapi: {
        appId: 'wx123',
        timeStamp: '1712345678',
        nonceStr: 'nonce-123',
        package: 'prepay_id=wx123',
        signType: 'RSA',
        paySign: 'signed-payload',
      },
    }), {
      visibleMethod: 'wxpay',
      orderType: 'subscription',
      isMobile: true,
    })

    expect(decision.kind).toBe('wechat_jsapi')
    expect(decision.jsapi?.appId).toBe('wx123')
    expect(decision.paymentState.orderType).toBe('subscription')
  })

  it('forces qr_waiting for mobile alipay when forceQRCode is enabled', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      pay_url: 'https://pay.example.com/mobile/session',
      qr_code: 'https://pay.example.com/qr/session',
    }), {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: true,
      forceQRCode: true,
    })

    expect(decision.kind).toBe('qr_waiting')
    expect(decision.paymentState.qrCode).toBe('https://pay.example.com/qr/session')
  })

  it('launches the Alipay app for a mobile precreate order', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      qr_code: 'https://qr.alipay.com/dynamic-order-101',
      alipay_mobile_precreate_deep_link: true,
    }), {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: true,
    })

    expect(decision.kind).toBe('alipay_deep_link')
    expect(decision.paymentState.qrCode).toBe('https://qr.alipay.com/dynamic-order-101')
    expect(decision.paymentState.alipayMobilePrecreateDeepLink).toBe(true)
  })

  it('keeps the desktop Alipay QR flow when a precreate marker is present', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      qr_code: 'https://qr.alipay.com/dynamic-order-102',
      alipay_mobile_precreate_deep_link: true,
    }), {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: false,
    })

    expect(decision.kind).toBe('qr_waiting')
  })

  it('does not affect non-alipay methods when forceQRCode is enabled', () => {
    const decision = decidePaymentLaunch(createOrderResult({
      pay_url: 'https://pay.example.com/mobile/session',
      qr_code: 'https://pay.example.com/qr/session',
    }), {
      visibleMethod: 'wxpay',
      orderType: 'balance',
      isMobile: true,
      forceQRCode: true,
    })

    // wxpay mobile with pay_url still redirects
    expect(decision.kind).toBe('redirect_waiting')
  })
})

describe('buildCreateOrderPayload', () => {
  it('normalizes visible method aliases and attaches a canonical result URL', () => {
    expect(buildCreateOrderPayload({
      amount: 88,
      paymentType: 'alipay_direct',
      orderType: 'balance',
      origin: 'https://app.example.com/',
      isMobile: true,
      isWechatBrowser: false,
    })).toEqual({
      amount: 88,
      payment_type: 'alipay',
      order_type: 'balance',
      return_url: 'https://app.example.com/payment/result',
      is_mobile: true,
      payment_source: 'hosted_redirect',
    })
  })

  it('uses WeChat in-app resume source for visible WeChat payments in the WeChat browser', () => {
    expect(buildCreateOrderPayload({
      amount: 128,
      paymentType: 'wxpay',
      orderType: 'subscription',
      planId: 7,
      origin: 'https://app.example.com',
      isMobile: false,
      isWechatBrowser: true,
    })).toEqual({
      amount: 128,
      payment_type: 'wxpay',
      order_type: 'subscription',
      plan_id: 7,
      return_url: 'https://app.example.com/payment/result',
      is_mobile: false,
      payment_source: 'wechat_in_app_resume',
    })
  })

  it('passes is_mobile: false when forceQRCode is enabled for alipay', () => {
    expect(buildCreateOrderPayload({
      amount: 50,
      paymentType: 'alipay',
      orderType: 'balance',
      origin: 'https://app.example.com',
      isMobile: true,
      isWechatBrowser: false,
      forceQRCode: true,
    })).toMatchObject({
      is_mobile: false,
    })
  })

  it('keeps is_mobile true when mobile precreate takes priority over forceQRCode', () => {
    expect(buildCreateOrderPayload({
      amount: 50,
      paymentType: 'alipay',
      orderType: 'balance',
      origin: 'https://app.example.com',
      isMobile: true,
      isWechatBrowser: false,
      forceQRCode: true,
      mobilePrecreateDeepLink: true,
    })).toMatchObject({
      is_mobile: true,
    })
  })

  it('still passes is_mobile: true when forceQRCode is enabled for non-alipay methods', () => {
    expect(buildCreateOrderPayload({
      amount: 50,
      paymentType: 'wxpay',
      orderType: 'balance',
      origin: 'https://app.example.com',
      isMobile: true,
      isWechatBrowser: false,
      forceQRCode: true,
    })).toMatchObject({
      is_mobile: true,
    })
  })
})

describe('readPaymentRecoverySnapshot', () => {
  it('restores an unexpired snapshot when the resume token matches', () => {
    const snapshot: PaymentRecoverySnapshot = {
      orderId: 33,
      amount: 18,
      qrCode: '',
      expiresAt: '2099-01-01T00:10:00.000Z',
      paymentType: 'alipay',
      payUrl: 'https://pay.example.com/session/33',
      outTradeNo: 'sub2_33',
      clientSecret: '',
      intentId: '',
      currency: '',
      countryCode: '',
      paymentEnv: '',
      payAmount: 18,
      orderType: 'balance',
      paymentMode: 'popup',
      resumeToken: 'resume-33',
      createdAt: Date.UTC(2099, 0, 1, 0, 0, 0),
    }

    const restored = readPaymentRecoverySnapshot(JSON.stringify(snapshot), {
      now: Date.UTC(2099, 0, 1, 0, 1, 0),
      resumeToken: 'resume-33',
    })

    expect(restored?.orderId).toBe(33)
  })

  it('drops expired or mismatched recovery snapshots', () => {
    const expiredSnapshot: PaymentRecoverySnapshot = {
      orderId: 55,
      amount: 18,
      qrCode: '',
      expiresAt: '2024-01-01T00:10:00.000Z',
      paymentType: 'wxpay',
      payUrl: 'https://pay.example.com/session/55',
      outTradeNo: 'sub2_55',
      clientSecret: '',
      intentId: '',
      currency: '',
      countryCode: '',
      paymentEnv: '',
      payAmount: 18,
      orderType: 'balance',
      paymentMode: 'popup',
      resumeToken: 'resume-55',
      createdAt: Date.UTC(2024, 0, 1, 0, 0, 0),
    }

    expect(readPaymentRecoverySnapshot(JSON.stringify(expiredSnapshot), {
      now: Date.UTC(2024, 0, 1, 0, 20, 0),
      resumeToken: 'resume-55',
    })).toBeNull()

    expect(readPaymentRecoverySnapshot(JSON.stringify({
      ...expiredSnapshot,
      outTradeNo: 'sub2_55',
      expiresAt: '2099-01-01T00:10:00.000Z',
    }), {
      now: Date.UTC(2099, 0, 1, 0, 1, 0),
      resumeToken: 'other-token',
    })).toBeNull()
  })

  it('keeps backward compatibility with snapshots written before outTradeNo existed', () => {
    const restored = readPaymentRecoverySnapshot(JSON.stringify({
      orderId: 44,
      amount: 18,
      qrCode: '',
      expiresAt: '2099-01-01T00:10:00.000Z',
      paymentType: 'alipay',
      payUrl: 'https://pay.example.com/session/44',
      clientSecret: '',
      payAmount: 18,
      orderType: 'balance',
      paymentMode: 'popup',
      resumeToken: 'resume-44',
      createdAt: Date.UTC(2099, 0, 1, 0, 0, 0),
    }), {
      now: Date.UTC(2099, 0, 1, 0, 1, 0),
      resumeToken: 'resume-44',
    })

    expect(restored?.orderId).toBe(44)
    expect(restored?.outTradeNo).toBe('')
  })

  it('keeps backward compatibility with snapshots written before Airwallex fields existed', () => {
    const restored = readPaymentRecoverySnapshot(JSON.stringify({
      orderId: 45,
      amount: 28,
      qrCode: '',
      expiresAt: '2099-01-01T00:10:00.000Z',
      paymentType: 'airwallex',
      payUrl: '/payment/airwallex?order_id=45',
      outTradeNo: 'sub2_45',
      clientSecret: 'awx_cs',
      payAmount: 28,
      orderType: 'balance',
      paymentMode: '',
      resumeToken: 'resume-45',
      createdAt: Date.UTC(2099, 0, 1, 0, 0, 0),
    }), {
      now: Date.UTC(2099, 0, 1, 0, 1, 0),
      resumeToken: 'resume-45',
    })

    expect(restored?.orderId).toBe(45)
    expect(restored?.intentId).toBe('')
    expect(restored?.currency).toBe('')
    expect(restored?.countryCode).toBe('')
    expect(restored?.paymentEnv).toBe('')
  })
})

describe('stripeSubMethodFor', () => {
  it('preselects the matching Stripe sub-method for visible alipay/wxpay buttons', () => {
    expect(stripeSubMethodFor('alipay')).toBe('alipay')
    expect(stripeSubMethodFor('alipay_direct')).toBe('alipay')
    expect(stripeSubMethodFor('wxpay')).toBe('wechat_pay')
    expect(stripeSubMethodFor('wxpay_direct')).toBe('wechat_pay')
  })

  it('leaves the sub-method unset for the dedicated Stripe button', () => {
    expect(stripeSubMethodFor('stripe')).toBeUndefined()
  })
})

describe('buildPaymentRouteTargets', () => {
  it('builds a Stripe target carrying the client secret and preselected sub-method', () => {
    const { stripe, airwallex } = buildPaymentRouteTargets(createOrderResult({
      client_secret: 'cs_test',
      resume_token: 'resume-1',
    }), 'wxpay')

    expect(stripe).toEqual({
      path: '/payment/stripe',
      query: {
        order_id: '101',
        client_secret: 'cs_test',
        method: 'wechat_pay',
        resume_token: 'resume-1',
      },
    })
    expect(airwallex).toBeNull()
  })

  it('builds an Airwallex target only when an intent id is present', () => {
    const withIntent = buildPaymentRouteTargets(createOrderResult({
      client_secret: 'awx_cs',
      intent_id: 'int_awx',
      out_trade_no: 'sub2_awx',
    }), 'airwallex')

    expect(withIntent.airwallex).toEqual({
      path: '/payment/airwallex',
      query: { order_id: '101', out_trade_no: 'sub2_awx', resume_token: undefined },
    })
    // Airwallex never goes through the Stripe page even though it has a client secret.
    expect(withIntent.stripe).toBeNull()

    expect(buildPaymentRouteTargets(createOrderResult({ client_secret: 'awx_cs' }), 'airwallex').airwallex).toBeNull()
  })

  it('builds nothing without a client secret', () => {
    expect(buildPaymentRouteTargets(createOrderResult(), 'alipay')).toEqual({ stripe: null, airwallex: null })
  })
})

describe('planPaymentLaunch', () => {
  function decisionOf(result: Partial<CreateOrderResult>, context: Parameters<typeof decidePaymentLaunch>[1]) {
    return decidePaymentLaunch(createOrderResult(result), context)
  }

  it('sends the browser to WeChat OAuth without entering the paying phase', () => {
    const decision = decisionOf(
      { result_type: 'oauth_required', oauth: { authorize_url: 'https://open.weixin.qq.com/authorize', app_id: 'wx', scope: 'snsapi_base', redirect_url: '/cb' } },
      { visibleMethod: 'wxpay', orderType: 'balance', isMobile: true, isWechatBrowser: true },
    )

    expect(planPaymentLaunch(decision, { isMobile: true })).toEqual({
      enterPaying: false,
      effect: { type: 'oauth', authorizeUrl: 'https://open.weixin.qq.com/authorize' },
    })
  })

  it('reports unhandled responses without entering the paying phase', () => {
    const decision = decisionOf({}, { visibleMethod: 'alipay', orderType: 'balance', isMobile: false })

    expect(decision.kind).toBe('unhandled')
    expect(planPaymentLaunch(decision, { isMobile: false })).toEqual({
      enterPaying: false,
      effect: { type: 'unhandled' },
    })
  })

  it('opens desktop Stripe Alipay in a popup and mobile Stripe in the current tab', () => {
    const desktop = decisionOf({ client_secret: 'cs_test' }, {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: false,
      stripePopupUrl: '/payment/stripe?popup=1',
      stripeRouteUrl: '/payment/stripe?route=1',
    })
    expect(planPaymentLaunch(desktop, { isMobile: false })).toEqual({
      enterPaying: true,
      effect: { type: 'popup', url: '/payment/stripe?popup=1' },
    })

    const mobile = decisionOf({ client_secret: 'cs_test' }, {
      visibleMethod: 'wxpay',
      orderType: 'balance',
      isMobile: true,
      stripeRouteUrl: '/payment/stripe?route=1',
    })
    expect(planPaymentLaunch(mobile, { isMobile: true })).toEqual({
      enterPaying: true,
      effect: { type: 'navigate', url: '/payment/stripe?route=1' },
    })
  })

  it('navigates to the hosted Airwallex page', () => {
    const decision = decisionOf({ client_secret: 'awx_cs', intent_id: 'int_awx' }, {
      visibleMethod: 'airwallex',
      orderType: 'balance',
      isMobile: false,
      airwallexRouteUrl: '/payment/airwallex?order_id=101',
    })

    expect(planPaymentLaunch(decision, { isMobile: false })).toEqual({
      enterPaying: true,
      effect: { type: 'navigate', url: '/payment/airwallex?order_id=101' },
    })
  })

  it('hands a ready jsapi payload to the WeChat bridge', () => {
    const jsapi = { appId: 'wx', timeStamp: '1', nonceStr: 'n', package: 'prepay_id=1', signType: 'RSA', paySign: 'sig' }
    const decision = decisionOf({ result_type: 'jsapi_ready', jsapi }, {
      visibleMethod: 'wxpay',
      orderType: 'balance',
      isMobile: true,
      isWechatBrowser: true,
    })

    expect(planPaymentLaunch(decision, { isMobile: true })).toEqual({
      enterPaying: true,
      effect: { type: 'jsapi', payload: jsapi },
    })
  })

  it('redirects the current tab on mobile but opens a popup on desktop', () => {
    const decision = decisionOf({ pay_url: 'https://gateway.example/pay' }, {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: true,
    })

    expect(decision.kind).toBe('redirect_waiting')
    expect(planPaymentLaunch(decision, { isMobile: true }).effect).toEqual({ type: 'navigate', url: 'https://gateway.example/pay' })
    expect(planPaymentLaunch(decision, { isMobile: false }).effect).toEqual({ type: 'popup', url: 'https://gateway.example/pay' })
  })

  it('waits on the status panel for QR and deep-link flows', () => {
    const qr = decisionOf({ qr_code: 'weixin://wxpay/bizpayurl?pr=abc' }, {
      visibleMethod: 'wxpay',
      orderType: 'balance',
      isMobile: false,
    })
    expect(qr.kind).toBe('qr_waiting')
    expect(planPaymentLaunch(qr, { isMobile: false })).toEqual({ enterPaying: true, effect: { type: 'await' } })

    const deepLink = decisionOf({ qr_code: 'https://qr.alipay.com/abc', alipay_mobile_precreate_deep_link: true }, {
      visibleMethod: 'alipay',
      orderType: 'balance',
      isMobile: true,
      mobilePrecreateDeepLink: true,
    })
    expect(deepLink.kind).toBe('alipay_deep_link')
    expect(planPaymentLaunch(deepLink, { isMobile: true })).toEqual({ enterPaying: true, effect: { type: 'await' } })
  })
})
