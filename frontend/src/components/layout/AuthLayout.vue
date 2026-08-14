<template>
  <div class="auth-shell">
    <span class="auth-glow auth-glow-one" aria-hidden="true"></span>
    <span class="auth-glow auth-glow-two" aria-hidden="true"></span>
    <span class="auth-grid" aria-hidden="true"></span>

    <main class="auth-frame">
      <section class="auth-brand-panel" :aria-label="t('auth.brandEyebrow')">
        <router-link to="/home" class="auth-brand-link">
          <span class="auth-brand-mark">
            <img :src="brandLogo" :alt="siteName + ' logo'" />
          </span>
          <span>
            <strong>OriginCoder</strong>
            <small>{{ t('auth.brandCaption') }}</small>
          </span>
        </router-link>

        <div class="auth-brand-copy">
          <p class="auth-eyebrow">{{ t('auth.brandEyebrow') }}</p>
          <h1>{{ t('auth.brandTitle') }}</h1>
          <p class="auth-brand-description">{{ t('auth.brandDescription') }}</p>
        </div>

        <ul class="auth-trust-list">
          <li v-for="item in trustItems" :key="item.label">
            <span><Icon :name="item.icon" size="sm" :stroke-width="2.2" /></span>
            {{ item.label }}
          </li>
        </ul>

        <div class="auth-gateway-card">
          <div class="auth-gateway-head">
            <span><i></i>{{ t('auth.brandEndpoint') }}</span>
            <strong>{{ t('auth.multiFormatCompatible') }}</strong>
          </div>
          <div class="auth-endpoint-list">
            <div v-for="format in gatewayFormats" :key="format.key" class="auth-endpoint">
              <span>POST</span>
              <code>{{ format.endpoint }}</code>
              <strong>{{ format.label }}</strong>
            </div>
          </div>
          <div class="auth-route">
            <span><Icon name="terminal" size="sm" /></span>
            <i></i>
            <span class="auth-route-brand"><img :src="brandLogo" alt="" /></span>
            <i></i>
            <span><Icon name="server" size="sm" /></span>
          </div>
          <p>{{ t('auth.brandRoute') }}</p>
        </div>
      </section>

      <section class="auth-form-side">
        <div class="auth-form-top">
          <div class="auth-mobile-brand">
            <img :src="brandLogo" :alt="siteName + ' logo'" />
            <strong>OriginCoder</strong>
          </div>
          <router-link to="/home">
            {{ t('auth.backHome') }}
            <Icon name="arrowRight" size="xs" />
          </router-link>
        </div>

        <div class="auth-form-wrap">
          <div class="auth-form-heading">
            <span><i></i>{{ t('auth.secureAccess') }}</span>
          </div>

          <div class="auth-form-card">
            <slot />
          </div>

          <div class="auth-footer-links">
            <slot name="footer" />
          </div>

          <div class="auth-copyright">
            &copy; {{ currentYear }} OriginCoder. {{ t('home.footer.allRightsReserved') }}
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'
import Icon from '@/components/icons/Icon.vue'
import { normalizeSiteName } from '@/utils/branding'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()
const appStore = useAppStore()
const BRAND_LOGO_URL = '/logo-v2.png?v=llm-provider-20260805'

const siteName = computed(() => normalizeSiteName(appStore.siteName))
const siteLogo = computed(() =>
  sanitizeUrl(appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true })
)
const brandLogo = computed(() =>
  siteName.value.toLowerCase() === 'llm provider'
    ? BRAND_LOGO_URL
    : siteLogo.value || BRAND_LOGO_URL
)
const currentYear = computed(() => new Date().getFullYear())
const trustItems = computed(() => [
  { icon: 'eye' as const, label: t('auth.brandTrustStatus') },
  { icon: 'document' as const, label: t('auth.brandTrustBilling') },
  { icon: 'chat' as const, label: t('auth.brandTrustSupport') },
])
const gatewayFormats = computed(() => [
  { key: 'openai', endpoint: '/v1/chat/completions', label: t('auth.openaiFormat') },
  { key: 'claude', endpoint: '/v1/messages', label: t('auth.claudeFormat') },
  {
    key: 'gemini',
    endpoint: '/v1beta/models/{model}:generateContent',
    label: t('auth.geminiFormat'),
  },
])

onMounted(() => {
  appStore.fetchPublicSettings()
})
</script>

<style scoped>
.auth-shell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  padding: 28px;
  color: #283680;
  background: #f7f8fc;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC",
    "Hiragino Sans GB", system-ui, sans-serif;
}
.auth-grid {
  position: fixed;
  inset: 0;
  opacity: .38;
  pointer-events: none;
  background-image: radial-gradient(circle at 1px 1px, rgba(73, 100, 244,.17) 1px, transparent 0);
  background-size: 25px 25px;
  mask-image: linear-gradient(135deg, #000, transparent 72%);
}
.auth-glow { position: fixed; border-radius: 50%; pointer-events: none; filter: blur(90px); }
.auth-glow-one { width: 420px; height: 420px; right: -110px; top: -130px; background: rgba(99,102,241,.18); }
.auth-glow-two { width: 480px; height: 480px; left: -190px; bottom: -210px; background: rgba(73, 100, 244,.18); }
.auth-frame {
  position: relative;
  z-index: 1;
  display: grid;
  width: 100%;
  max-width: 1160px;
  min-height: calc(100vh - 56px);
  grid-template-columns: 1.02fr .98fr;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #e0e7ff;
  border-radius: 30px;
  background: rgba(255,255,255,.9);
  box-shadow: 0 30px 90px rgba(63, 87, 220,.13);
  backdrop-filter: blur(20px);
}
.auth-brand-panel {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid #e0e7ff;
  padding: 48px 52px;
  background: linear-gradient(145deg, #eef2ff 0%, #f2f5ff 58%, #f7f8fc 100%);
}
.auth-brand-panel::after {
  position: absolute;
  width: 280px;
  height: 280px;
  right: -110px;
  bottom: -100px;
  border: 1px solid rgba(73, 100, 244,.17);
  border-radius: 50%;
  box-shadow: 0 0 0 45px rgba(73, 100, 244,.035), 0 0 0 90px rgba(73, 100, 244,.025);
  content: "";
}
.auth-brand-link { display: flex; width: fit-content; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
.auth-brand-mark { display: flex; width: 46px; height: 46px; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #c7d2fe; border-radius: 15px; background: #fff; box-shadow: 0 10px 24px rgba(63, 87, 220,.12); }
.auth-brand-mark img { width: 100%; height: 100%; object-fit: contain; }
.auth-brand-link strong { display: block; color: #283680; font-size: 16px; font-weight: 900; letter-spacing: -.025em; }
.auth-brand-link small { display: block; margin-top: 2px; color: #6b7280; font-size: 9px; font-weight: 700; }
.auth-brand-copy { position: relative; z-index: 1; margin-top: 75px; }
.auth-eyebrow { color: #3f57dc; font-size: 10px; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
.auth-brand-copy h1 { max-width: 490px; margin-top: 15px; color: #283680; font-size: clamp(37px, 3.6vw, 49px); font-weight: 950; line-height: 1.12; letter-spacing: -.05em; }
.auth-brand-description { max-width: 475px; margin-top: 21px; color: #4b5563; font-size: 14px; line-height: 1.85; }
.auth-trust-list { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 25px; }
.auth-trust-list li { display: flex; align-items: center; gap: 7px; color: #374151; font-size: 10px; font-weight: 800; }
.auth-trust-list li span { display: flex; width: 23px; height: 23px; align-items: center; justify-content: center; border-radius: 8px; color: #3f57dc; background: #e0e7ff; }
.auth-gateway-card { position: relative; z-index: 1; margin-top: auto; border: 1px solid rgba(199,210,254,.9); border-radius: 22px; padding: 20px; background: rgba(255,255,255,.76); box-shadow: 0 18px 45px rgba(63, 87, 220,.08); backdrop-filter: blur(12px); }
.auth-gateway-head { display: flex; align-items: center; justify-content: space-between; gap: 15px; }
.auth-gateway-head span { display: flex; align-items: center; gap: 7px; color: #354bd2; font-size: 10px; font-weight: 850; }
.auth-gateway-head i { width: 7px; height: 7px; border-radius: 50%; background: #7b8ef8; box-shadow: 0 0 0 4px rgba(123, 142, 248,.12); }
.auth-gateway-head strong { color: #9ca3af; font-size: 8px; font-weight: 800; }
.auth-endpoint-list { display: grid; gap: 7px; margin-top: 15px; }
.auth-endpoint { display: flex; min-width: 0; align-items: center; gap: 10px; border: 1px solid #e0e7ff; border-radius: 11px; padding: 9px 11px; background: #f7f8fc; }
.auth-endpoint span { border-radius: 6px; padding: 4px 7px; color: #354bd2; background: #e0e7ff; font-size: 8px; font-weight: 900; }
.auth-endpoint code { min-width: 0; overflow: hidden; color: #374151; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.auth-endpoint strong { margin-left: auto; flex: none; color: #3f57dc; font-size: 8px; font-weight: 850; }
.auth-route { display: grid; grid-template-columns: 36px 1fr 36px 1fr 36px; align-items: center; gap: 8px; margin-top: 17px; }
.auth-route > span { display: flex; width: 36px; height: 36px; align-items: center; justify-content: center; border: 1px solid #c7d2fe; border-radius: 11px; color: #3f57dc; background: #fff; }
.auth-route > i { height: 1px; background: linear-gradient(to right, #c7d2fe, #4964f4); }
.auth-route-brand { border-color: #a5b4fc !important; background: #eef2ff !important; box-shadow: 0 5px 16px rgba(73, 100, 244,.12); }
.auth-route-brand img { width: 25px; height: 25px; object-fit: contain; }
.auth-gateway-card > p { margin-top: 11px; color: #9ca3af; font-size: 9px; text-align: center; }
.auth-form-side { position: relative; display: flex; min-width: 0; flex-direction: column; padding: 34px 46px 28px; background: rgba(255,255,255,.78); }
.auth-form-top { display: flex; min-height: 38px; align-items: center; justify-content: flex-end; }
.auth-form-top > a { display: inline-flex; align-items: center; gap: 6px; border-radius: 10px; padding: 8px 10px; color: #4b5563; font-size: 10px; font-weight: 800; text-decoration: none; transition: .2s ease; }
.auth-form-top > a:hover { color: #3f57dc; background: #eef2ff; }
.auth-mobile-brand { display: none; align-items: center; gap: 9px; }
.auth-mobile-brand img { width: 34px; height: 34px; border-radius: 10px; object-fit: contain; }
.auth-mobile-brand strong { color: #283680; font-size: 14px; font-weight: 900; }
.auth-form-wrap { width: 100%; max-width: 440px; margin: auto; padding: 30px 0; }
.auth-form-heading { margin-bottom: 12px; text-align: center; }
.auth-form-heading span { display: inline-flex; align-items: center; gap: 7px; color: #6b7280; font-size: 9px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.auth-form-heading i { width: 6px; height: 6px; border-radius: 50%; background: #7b8ef8; box-shadow: 0 0 0 4px rgba(123, 142, 248,.12); }
.auth-form-card { border: 1px solid #e0e7ff; border-radius: 23px; padding: 30px; background: #fff; box-shadow: 0 18px 50px rgba(63, 87, 220,.09); }
.auth-footer-links { margin-top: 20px; color: #6b7280; font-size: 13px; text-align: center; }
.auth-copyright { margin-top: 28px; color: #9ca3af; font-size: 9px; text-align: center; }

.auth-shell :deep(.btn-primary) { min-height: 46px; }
.auth-shell :deep(.input) { min-height: 44px; }
.auth-shell :deep(h2) { color: #283680; }

@media (max-width: 900px) {
  .auth-shell { padding: 18px; }
  .auth-frame { min-height: calc(100vh - 36px); grid-template-columns: 1fr; }
  .auth-brand-panel { min-height: 390px; border-right: 0; border-bottom: 1px solid #e0e7ff; padding: 34px 38px; }
  .auth-brand-copy { margin-top: 38px; }
  .auth-brand-copy h1 { max-width: 620px; font-size: 37px; }
  .auth-brand-description { max-width: 650px; }
  .auth-gateway-card { display: none; }
  .auth-form-side { padding: 28px 38px; }
  .auth-form-wrap { padding-top: 20px; }
}

@media (max-width: 640px) {
  .auth-shell { padding: 0; }
  .auth-frame { min-height: 100vh; border: 0; border-radius: 0; }
  .auth-brand-panel { min-height: auto; padding: 25px 20px 30px; }
  .auth-brand-copy { margin-top: 27px; }
  .auth-brand-copy h1 { margin-top: 10px; font-size: 29px; }
  .auth-brand-description { margin-top: 13px; font-size: 12px; line-height: 1.7; }
  .auth-trust-list { gap: 8px 12px; margin-top: 17px; }
  .auth-trust-list li { font-size: 9px; }
  .auth-form-side { padding: 20px 16px 24px; }
  .auth-form-top { justify-content: space-between; }
  .auth-mobile-brand { display: flex; }
  .auth-form-wrap { max-width: 100%; padding: 24px 0 10px; }
  .auth-form-card { border-radius: 19px; padding: 24px 20px; }
}
</style>
