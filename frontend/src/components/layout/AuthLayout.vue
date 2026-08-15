<template>
  <div class="auth-shell">
    <header class="auth-header">
      <div class="auth-inner auth-header-inner">
        <router-link to="/home" class="brand-link" :aria-label="siteName">
          <span class="brand-mark">
            <img :src="brandLogo" :alt="siteName + ' logo'" />
          </span>
          <strong class="brand-name">OriginCoder</strong>
        </router-link>

      </div>
    </header>

    <main class="auth-main">
      <div class="auth-inner auth-grid">
        <section class="auth-brand" :aria-label="t('auth.brandEyebrow')">
          <p class="eyebrow">{{ t('auth.brandEyebrow') }}</p>
          <h1 class="brand-title">{{ t('auth.brandTitle') }}</h1>
          <p class="brand-lead">{{ t('auth.brandDescription') }}</p>


          <div class="panel">
            <div class="panel-head">
              <span class="panel-title">{{ t('auth.brandEndpoint') }}</span>
            </div>
            <ol class="after-list">
              <li v-for="(item, index) in afterSignIn" :key="item">
                <span class="after-n">{{ index + 1 }}</span>
                {{ item }}
              </li>
            </ol>
          </div>
        </section>

        <section class="auth-form-side">
          <div class="auth-card">
            <slot />

            <div class="auth-footer-links">
              <slot name="footer" />
            </div>
          </div>

          <p class="auth-copyright">
            &copy; {{ currentYear }} OriginCoder. {{ t('home.footer.allRightsReserved') }}
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'
import { normalizeSiteName } from '@/utils/branding'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()
const appStore = useAppStore()
const BRAND_LOGO_URL = '/logo-v2.png?v=frame-20260815'
// 标记是单色的：近黑框在深色底上会看不见，所以按主题换文件。
const BRAND_LOGO_URL_DARK = '/logo-v2-dark.png?v=frame-20260815'

const siteName = computed(() => normalizeSiteName(appStore.siteName))
const siteLogo = computed(() =>
  sanitizeUrl(appStore.siteLogo || '', { allowRelative: true, allowDataUrl: true })
)

// 主题由全局在 <html> 上切换，这里只跟随，不提供开关。
const isDark = ref(document.documentElement.classList.contains('dark'))
let themeObserver: MutationObserver | undefined

// 自建实例配了自己的 logo 就直接用；默认品牌才按主题换反白版本。
const brandLogo = computed(() => {
  if (siteName.value.toLowerCase() === 'llm provider' || !siteLogo.value) {
    return isDark.value ? BRAND_LOGO_URL_DARK : BRAND_LOGO_URL
  }
  return siteLogo.value
})

const currentYear = computed(() => new Date().getFullYear())
const afterSignIn = computed(() => [
  t('auth.brandTrustStatus'),
  t('auth.brandTrustBilling'),
  t('auth.brandTrustSupport'),
])

onMounted(() => {
  appStore.fetchPublicSettings()
  if (typeof MutationObserver === 'undefined') return
  themeObserver = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = undefined
})
</script>

<style scoped>
/*
 * 与 HomeView 同一套令牌：全站无彩，层次靠明度；分区之间不画分割线，只留白。
 */
.auth-shell {
  /* 全部引用 tailwind.config.js 的色阶，与首页 / 控制台同源，改配置三处一起变 */
  /* 暖浅灰主题（对标 elevenlabs.io 实测：#f5f3f1 / #ebe8e4 暖灰 + 纯黑字） */
  --bg: #f5f3f1;
  --surface: #ffffff;
  --surface-2: #ebe8e4;
  --border: rgba(0, 0, 0, .08);
  --border-2: rgba(0, 0, 0, .16);
  --fg: #000000;
  --muted: rgba(0, 0, 0, .58);
  --dim: rgba(0, 0, 0, .40);
  --primary: theme('colors.primary.700');
  --primary-hover: theme('colors.primary.800');
  --primary-fg: #ffffff;
  --shadow: 0 1px 2px rgba(17, 24, 39, .04);
  --r: 14px;

  display: flex;
  min-height: 100vh;
  flex-direction: column;
  overflow-x: hidden;
  color: var(--fg);
  background: var(--bg);
  font-size: 15px;
  letter-spacing: -.006em;
}
html.dark .auth-shell {
  --bg: theme('colors.dark.950');
  --surface: theme('colors.dark.900');
  --surface-2: theme('colors.dark.800');
  --border: theme('colors.dark.700');
  --border-2: theme('colors.dark.600');
  --fg: #ffffff;
  --muted: theme('colors.dark.300');
  --dim: theme('colors.dark.400');
  --primary: theme('colors.primary.50');
  --primary-hover: #ffffff;
  --primary-fg: theme('colors.primary.950');
  --shadow: 0 1px 2px rgba(0, 0, 0, .4);
}

.auth-inner { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 28px; }
.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); }

/* Header：不加底边框，靠留白分区 */
.auth-header-inner { display: flex; align-items: center; gap: 20px; height: 62px; }
.brand-link { display: flex; align-items: center; gap: 9px; color: inherit; text-decoration: none; }
.brand-mark {
  display: flex;
  width: 26px;
  height: 26px;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
}
.brand-mark img { width: 100%; height: 100%; object-fit: contain; }
.brand-name { font-size: 15.5px; font-weight: 700; letter-spacing: -.02em; }

/* 主体：左品牌 / 右表单 */
.auth-main { display: flex; flex: 1; align-items: center; padding: 20px 0 44px; }
.auth-grid { display: grid; grid-template-columns: 1fr 400px; gap: 56px; align-items: center; }

.auth-brand { min-width: 0; }
.brand-title {
  margin-top: 13px;
  font-size: clamp(28px, 3.2vw, 40px);
  font-weight: 300;
  letter-spacing: -.035em;
  line-height: 1.12;
  max-width: 16ch;
}
.brand-lead { margin-top: 14px; max-width: 46ch; color: var(--muted); font-size: 15px; line-height: 1.7; }


.panel {
  margin-top: 28px;
  max-width: 520px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--r);
  background: var(--surface);
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  padding: 13px 18px;
}
.panel-title { font-size: 13px; font-weight: 650; }
.after-list { list-style: none; margin: 0; padding: 14px 18px 18px; display: grid; gap: 12px; }
.after-list li { display: flex; align-items: center; gap: 12px; color: var(--fg); font-size: 13.5px; }
.after-n {
  display: grid;
  width: 24px;
  height: 24px;
  flex: none;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--surface-2);
  border-color: var(--border);
  color: var(--fg);
  font-size: 11.5px;
  font-weight: 650;
}

/* 右侧表单 */
.auth-form-side { min-width: 0; }
.auth-card {
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 28px;
  background: var(--surface);
  box-shadow: var(--shadow);
}
.auth-footer-links { margin-top: 20px; color: var(--muted); font-size: 13.5px; text-align: center; }
.auth-copyright { margin-top: 16px; color: var(--dim); font-size: 12px; text-align: center; }

/* 把插槽里的表单控件对齐到首页的控件语言：10px 圆角、中性描边 */
.auth-shell :deep(.input) {
  min-height: 44px;
  border-radius: 10px;
  border-color: var(--border);
  background: var(--surface-2);
}
.auth-shell :deep(.input:focus) {
  border-color: var(--border-2);
  box-shadow: none;
}
.auth-shell :deep(.btn) { border-radius: 10px; }
.auth-shell :deep(.btn-primary) { min-height: 44px; border-radius: 10px; }
.auth-shell :deep(.btn-secondary) { border-radius: 10px; }
.auth-shell :deep(h2) { color: var(--fg); font-size: 22px; letter-spacing: -.028em; }

@media (max-width: 1080px) {
  .auth-grid { grid-template-columns: 1fr; gap: 32px; align-items: start; }
  .auth-main { padding: 12px 0 36px; }
  .brand-title { max-width: 20ch; font-size: 30px; }
  .brand-lead { max-width: 60ch; }
  .panel { display: none; }
  .auth-form-side { max-width: 440px; }
}

@media (max-width: 640px) {
  .auth-inner { padding: 0 18px; }
  .auth-brand { display: none; }
  .auth-main { align-items: flex-start; padding: 8px 0 28px; }
  .auth-form-side { max-width: 100%; }
  .auth-card { border: 0; padding: 4px 0 0; background: transparent; box-shadow: none; }
}

@media (prefers-reduced-motion: reduce) {
  .auth-shell *, .auth-shell *::before, .auth-shell *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
</style>
