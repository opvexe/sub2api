<template>
  <!-- Custom Home Content: Full Page Mode -->
  <div v-if="hasHomeContent" class="min-h-screen bg-white">
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      :title="`${siteName} home content`"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <!-- homeContent is an administrator-managed setting. -->
    <div v-else v-html="homeContent"></div>
  </div>

  <!-- Compact Home Page -->
  <div
    v-else-if="compactHomeEnabled"
    data-testid="compact-home"
    class="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-dark-950 dark:text-white"
  >
    <header class="border-b border-gray-200 px-4 py-4 sm:px-6 dark:border-dark-800">
      <nav class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <img
            :src="siteLogo || '/logo.svg'"
            alt="Logo"
            class="h-9 w-9 shrink-0 rounded-lg object-contain"
          />
          <span class="min-w-0 truncate text-base font-semibold">{{ siteName }}</span>
        </div>
        <div class="flex max-w-full shrink-0 flex-wrap items-center justify-end gap-2">
          <LocaleSwitcher />
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-dark-400 dark:hover:bg-dark-800"
            :title="t('home.viewDocs')"
          >
            <Icon name="book" size="md" />
          </a>
          <button
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-dark-400 dark:hover:bg-dark-800"
            :title="isDark ? t('home.switchToLight') : t('home.switchToDark')"
            @click="toggleTheme"
          >
            <Icon v-if="isDark" name="sun" size="md" />
            <Icon v-else name="moon" size="md" />
          </button>
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {{ isAuthenticated ? t('home.dashboard') : t('home.login') }}
          </router-link>
        </div>
      </nav>
    </header>

    <main class="flex min-w-0 flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <div class="min-w-0 max-w-2xl text-center">
        <img
          :src="siteLogo || '/logo.svg'"
          alt="Logo"
          class="mx-auto mb-6 h-20 w-20 rounded-2xl object-contain"
        />
        <h1 class="[overflow-wrap:anywhere] text-3xl font-bold md:text-4xl">{{ siteName }}</h1>
        <p class="mt-4 whitespace-pre-wrap [overflow-wrap:anywhere] text-base text-gray-600 dark:text-dark-300">{{ siteSubtitle }}</p>
        <router-link
          :to="isAuthenticated ? dashboardPath : '/login'"
          class="mt-8 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          {{ isAuthenticated ? t('home.goToDashboard') : t('home.login') }}
        </router-link>
      </div>
    </main>

    <footer class="min-w-0 border-t border-gray-200 px-4 py-5 text-center text-sm text-gray-500 [overflow-wrap:anywhere] sm:px-6 dark:border-dark-800 dark:text-dark-400">
      &copy; {{ currentYear }} {{ siteName }}
    </footer>
  </div>

  <!-- LLM Provider brand home -->
  <div v-else class="home-shell">
    <header class="home-header">
      <nav class="section-inner home-nav" :aria-label="t('home.nav.primary')">
        <router-link to="/home" class="brand-link" :aria-label="siteName">
          <span class="brand-mark">
            <img :src="brandLogo" :alt="siteName + ' logo'" class="h-full w-full object-contain" />
          </span>
          <span class="min-w-0">
            <strong class="brand-name">LLM Provider</strong>
            <small class="brand-caption">{{ t('home.brandCaption') }}</small>
          </span>
        </router-link>

        <div class="nav-links">
          <a v-for="link in navLinks" :key="link.href" :href="link.href">{{ link.label }}</a>
        </div>

        <div class="nav-actions">
          <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer" class="docs-link">
            {{ t('home.docs') }}
          </a>
          <LocaleSwitcher class="home-locale" />
          <router-link :to="isAuthenticated ? dashboardPath : '/login'" class="header-action">
            {{ isAuthenticated ? t('home.dashboard') : t('home.login') }}
          </router-link>
        </div>
      </nav>
    </header>

    <main>
      <!-- Main API relay proposition -->
      <section id="service" class="hero-section">
        <div class="hero-grid-bg" aria-hidden="true"></div>
        <div class="hero-glow hero-glow-one" aria-hidden="true"></div>
        <div class="hero-glow hero-glow-two" aria-hidden="true"></div>

        <div class="section-inner hero-layout">
          <div class="hero-copy">
            <div class="brand-pill">
              <span class="brand-pill-dot"></span>
              {{ t('home.heroEyebrow') }}
            </div>

            <h1 class="hero-title">
              <span>{{ t('home.heroTitleLead') }}</span>
              <span class="hero-title-accent">{{ t('home.heroTitleAccent') }}</span>
            </h1>

            <p class="hero-description">{{ t('home.heroDescription') }}</p>

            <div class="hero-actions">
              <router-link :to="isAuthenticated ? dashboardPath : '/register'" class="primary-action">
                {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
                <Icon name="arrowRight" size="sm" :stroke-width="2.4" aria-hidden="true" />
              </router-link>
              <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer" class="secondary-action">
                <Icon name="book" size="sm" :stroke-width="2" aria-hidden="true" />
                {{ t('home.viewDocs') }}
              </a>
            </div>

            <ul class="hero-trust-list" :aria-label="t('home.highlights')">
              <li v-for="item in heroTrustItems" :key="item">
                <Icon name="checkCircle" size="sm" :stroke-width="2.2" aria-hidden="true" />
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Honest service status panel -->
          <div class="service-console" :aria-label="t('home.servicePreview.title')">
            <div class="console-topbar">
              <div class="console-window-dots" aria-hidden="true"><span></span><span></span><span></span></div>
              <span class="console-title">{{ t('home.servicePreview.console') }}</span>
              <span class="console-live"><span></span>{{ t('home.servicePreview.live') }}</span>
            </div>

            <div class="console-body">
              <div class="console-status-head">
                <div>
                  <p>{{ t('home.servicePreview.title') }}</p>
                  <h2>{{ t('home.servicePreview.allHealthy') }}</h2>
                </div>
                <span class="health-orbit">
                  <span></span>
                  <Icon name="shield" size="lg" :stroke-width="1.8" />
                </span>
              </div>

              <div class="request-list" :aria-label="t('home.servicePreview.formats.title')">
                <div v-for="format in requestFormats" :key="format.key" class="request-box">
                  <div class="request-method">POST</div>
                  <code>{{ format.endpoint }}</code>
                  <span>{{ format.label }}</span>
                </div>
              </div>

              <div class="route-flow" :aria-label="t('home.servicePreview.route')">
                <div class="route-node">
                  <span><Icon name="terminal" size="sm" :stroke-width="2" /></span>
                  <small>{{ t('home.servicePreview.yourApp') }}</small>
                </div>
                <div class="route-line"><span></span><Icon name="chevronRight" size="xs" /></div>
                <div class="route-node route-node-primary">
                  <span><img :src="brandLogo" alt="" /></span>
                  <small>LLM Provider</small>
                </div>
                <div class="route-line"><span></span><Icon name="chevronRight" size="xs" /></div>
                <div class="route-node">
                  <span><Icon name="server" size="sm" :stroke-width="2" /></span>
                  <small>{{ t('home.servicePreview.bestRoute') }}</small>
                </div>
              </div>

              <div class="console-event-list">
                <div v-for="event in serviceEvents" :key="event.key" class="console-event">
                  <span class="event-check"><Icon name="check" size="xs" :stroke-width="3" /></span>
                  <div>
                    <strong>{{ event.title }}</strong>
                    <small>{{ event.description }}</small>
                  </div>
                  <span class="event-status">{{ t('home.servicePreview.normal') }}</span>
                </div>
              </div>

              <div class="provider-row">
                <span v-for="provider in providers" :key="provider">{{ provider }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Credibility facts, no fabricated volume -->
      <section id="guarantees" class="trust-bar" :aria-label="t('home.trustBar.title')">
        <div class="section-inner trust-grid">
          <article v-for="item in trustBarItems" :key="item.key" class="trust-bar-item">
            <span class="trust-bar-icon"><Icon :name="item.icon" size="md" :stroke-width="2" /></span>
            <div><strong>{{ item.title }}</strong><p>{{ item.description }}</p></div>
          </article>
        </div>
      </section>

      <!-- Compact promotion for one other product -->
      <section id="ecosystem" class="section ecosystem-section">
        <div class="section-inner">
          <a
            href="https://shop.visioncoder.ai"
            target="_blank"
            rel="noopener noreferrer"
            class="ecosystem-card"
          >
            <span class="ecosystem-grid" aria-hidden="true"></span>
            <div class="ecosystem-art" aria-hidden="true">
              <span class="ecosystem-orbit orbit-one"></span>
              <span class="ecosystem-orbit orbit-two"></span>
              <span class="ecosystem-cube"><Icon name="cube" size="xl" :stroke-width="1.5" /></span>
            </div>
            <div class="ecosystem-copy">
              <p class="ecosystem-eyebrow">{{ t('home.ecosystem.eyebrow') }}</p>
              <h2>{{ t('home.ecosystem.title') }}</h2>
              <p>{{ t('home.ecosystem.description') }}</p>
              <ul>
                <li v-for="tag in ecosystemTags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
            <span class="ecosystem-action">
              {{ t('home.ecosystem.action') }}
              <Icon name="arrowRight" size="sm" :stroke-width="2.4" />
            </span>
          </a>
        </div>
      </section>

    </main>

    <footer class="site-footer">
      <div class="section-inner">
        <div class="footer-main">
          <div class="footer-brand">
            <span class="brand-mark"><img :src="brandLogo" :alt="siteName + ' logo'" /></span>
            <div><strong>LLM Provider</strong><p>{{ t('home.footer.description') }}</p></div>
          </div>
          <nav class="footer-nav" :aria-label="t('home.footer.navigation')">
            <strong>{{ t('home.footer.navigation') }}</strong>
            <div class="footer-links">
              <a href="#service">{{ t('home.nav.service') }}</a>
              <a href="#guarantees">{{ t('home.nav.guarantees') }}</a>
              <a href="#ecosystem">{{ t('home.nav.ecosystem') }}</a>
              <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">{{ t('home.docs') }}</a>
              <router-link to="/register">{{ t('home.cta.button') }}</router-link>
              <router-link to="/login">{{ t('home.login') }}</router-link>
            </div>
          </nav>
          <div class="footer-contact">
            <strong>{{ t('home.footer.contact') }}</strong>
            <p v-if="contactInfo">{{ contactInfo }}</p>
            <p v-else>{{ t('home.footer.contactDescription') }}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; {{ currentYear }} LLM Provider. {{ t('home.footer.allRightsReserved') }}</span>
          <span>{{ t('home.footer.slogan') }}</span>
        </div>
      </div>
    </footer>

    <!-- Floating multi-channel support -->
    <details id="support" class="support-dock">
      <summary :aria-label="t('home.community.openSupport')">
        <span class="support-online" aria-hidden="true"></span>
        <Icon name="chat" size="lg" :stroke-width="1.9" />
        <span>{{ t('home.community.support') }}</span>
      </summary>
      <div class="support-panel">
        <div class="support-head">
          <div><strong>{{ t('home.community.title') }}</strong><p>{{ t('home.community.description') }}</p></div>
          <span><i></i>{{ t('home.community.online') }}</span>
        </div>
        <div class="support-list">
          <a
            v-for="support in supportLinks"
            :key="support.key"
            :href="support.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="support-logo" :class="'support-' + support.key">
              <span v-if="support.key === 'qq'" class="qq-monogram">QQ</span>
              <svg v-else viewBox="0 0 24 24" fill="currentColor"><path :d="support.path" /></svg>
            </span>
            <span><strong>{{ support.label }}</strong><small>{{ support.description }}</small></span>
            <Icon name="arrowRight" size="sm" :stroke-width="2" />
          </a>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useAppStore } from '@/stores'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'
import { normalizeSiteName } from '@/utils/branding'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()
const authStore = useAuthStore()
const appStore = useAppStore()
const BRAND_LOGO_URL = '/logo-v2.png?v=llm-provider-20260805'

// 留空的客服渠道不会展示。
const CONTACT = {
  telegram: 'https://t.me/VisionCoderxhn',
  discord: 'https://discord.gg/2C6Qvd36pq',
  qq: 'mqqapi://card/show_pslcard?src_type=internal&version=1&uin=619737520&card_type=group&source=qrcode',
}

const TELEGRAM_PATH =
  'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'
const DISCORD_PATH =
  'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z'

const siteName = computed(() =>
  normalizeSiteName(appStore.cachedPublicSettings?.site_name || appStore.siteName || '')
)
const siteLogo = computed(() =>
  sanitizeUrl(appStore.cachedPublicSettings?.site_logo || appStore.siteLogo || '', {
    allowRelative: true,
    allowDataUrl: true,
  })
)
const brandLogo = computed(() => BRAND_LOGO_URL)
const siteSubtitle = computed(() => {
  const configuredSubtitle = appStore.cachedPublicSettings?.site_subtitle?.trim()
  const defaults = ['AI API Gateway Platform', 'Subscription to API Conversion Platform']
  return configuredSubtitle && !defaults.includes(configuredSubtitle)
    ? configuredSubtitle
    : t('home.productTagline')
})
const docUrl = computed(() =>
  sanitizeUrl(appStore.cachedPublicSettings?.doc_url || appStore.docUrl || '')
)
const contactInfo = computed(() => appStore.contactInfo)
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')
const hasHomeContent = computed(() => homeContent.value.trim().length > 0)
const compactHomeEnabled = computed(
  () => appStore.cachedPublicSettings?.compact_home_enabled === true
)
const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})
const isAuthenticated = computed(() => authStore.isAuthenticated)
const dashboardPath = computed(() => (authStore.isAdmin ? '/admin/dashboard' : '/dashboard'))
const currentYear = computed(() => new Date().getFullYear())

const navLinks = computed(() => [
  { href: '#service', label: t('home.nav.service') },
  { href: '#guarantees', label: t('home.nav.guarantees') },
  { href: '#ecosystem', label: t('home.nav.ecosystem') },
])

const heroTrustItems = computed(() => [
  t('home.heroTrust.status'),
  t('home.heroTrust.billing'),
  t('home.heroTrust.support'),
])

const providers = ['Claude', 'GPT', 'Gemini', 'More']

const REQUEST_FORMATS = [
  { key: 'openai', endpoint: '/v1/chat/completions' },
  { key: 'claude', endpoint: '/v1/messages' },
  { key: 'gemini', endpoint: '/v1beta/models/{model}:generateContent' },
] as const
const requestFormats = computed(() =>
  REQUEST_FORMATS.map((format) => ({
    ...format,
    label: t('home.servicePreview.formats.' + format.key),
  }))
)

const SERVICE_EVENT_SLOTS = ['health', 'routing', 'billing'] as const
const serviceEvents = computed(() =>
  SERVICE_EVENT_SLOTS.map((key) => ({
    key,
    title: t('home.servicePreview.events.' + key + '.title'),
    description: t('home.servicePreview.events.' + key + '.description'),
  }))
)

const TRUST_BAR_SLOTS = [
  { key: 'monitoring', icon: 'eye' },
  { key: 'records', icon: 'document' },
  { key: 'failover', icon: 'arrowsUpDown' },
  { key: 'support', icon: 'chat' },
] as const
const trustBarItems = computed(() =>
  TRUST_BAR_SLOTS.map((slot) => ({
    ...slot,
    title: t('home.trustBar.items.' + slot.key + '.title'),
    description: t('home.trustBar.items.' + slot.key + '.description'),
  }))
)

const ecosystemTags = computed(() => [
  t('home.ecosystem.tags.subscription'),
  t('home.ecosystem.tags.codes'),
  t('home.ecosystem.tags.delivery'),
])
const supportLinks = computed(() =>
  [
    {
      key: 'telegram',
      href: CONTACT.telegram,
      label: t('home.community.telegram'),
      description: t('home.community.telegramDescription'),
      path: TELEGRAM_PATH,
    },
    {
      key: 'discord',
      href: CONTACT.discord,
      label: t('home.community.discord'),
      description: t('home.community.discordDescription'),
      path: DISCORD_PATH,
    },
    {
      key: 'qq',
      href: CONTACT.qq,
      label: t('home.community.qq'),
      description: t('home.community.qqDescription'),
      path: '',
    },
  ].filter((item) => item.href)
)

// Theme (used by the compact home page)
const isDark = ref(document.documentElement.classList.contains('dark'))
function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}
function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}
onMounted(() => {
  initTheme()
  authStore.checkAuth()
  if (!appStore.publicSettingsLoaded) appStore.fetchPublicSettings()
})
</script>

<style scoped>
.home-shell {
  min-height: 100vh;
  overflow-x: hidden;
  color: #134e4a;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC",
    "Hiragino Sans GB", system-ui, sans-serif;
}
.home-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid rgba(226, 232, 240, .88);
  background: rgba(255, 255, 255, .88);
  backdrop-filter: blur(18px);
}
.section-inner {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}
.home-nav {
  display: flex;
  height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand-link {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}
.brand-mark {
  display: flex;
  width: 42px;
  height: 42px;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 5px 16px rgba(15, 23, 42, .06);
}
.brand-name { display: block; font-size: 15px; font-weight: 900; letter-spacing: -.02em; }
.brand-caption { display: block; margin-top: 1px; font-size: 9px; font-weight: 700; color: #94a3b8; }
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-links a, .docs-link {
  border-radius: 10px;
  padding: 9px 13px;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: .2s ease;
}
.nav-links a:hover, .docs-link:hover { color: #0d9488; background: #f0fdfa; }
.nav-actions { display: flex; flex: none; align-items: center; gap: 8px; }
.header-action {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  padding: 0 16px;
  color: #fff;
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  transition: .2s ease;
}
.header-action:hover { background: linear-gradient(135deg, #0d9488, #0f766e); }

/* Hero */
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 92px 0 96px;
  background: linear-gradient(180deg, #f8faff 0%, #fff 88%);
}
.hero-grid-bg {
  position: absolute;
  inset: 0;
  opacity: .35;
  background-image: radial-gradient(circle at 1px 1px, rgba(20, 184, 166, .2) 1px, transparent 0);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, #000, transparent 90%);
}
.hero-glow { position: absolute; border-radius: 999px; filter: blur(90px); pointer-events: none; }
.hero-glow-one { width: 440px; height: 440px; right: -180px; top: -120px; background: rgba(20, 184, 166, .18); }
.hero-glow-two { width: 330px; height: 330px; left: -160px; bottom: -180px; background: rgba(6, 182, 212, .13); }
.hero-layout {
  position: relative;
  display: grid;
  grid-template-columns: .92fr 1.08fr;
  align-items: center;
  gap: 70px;
}
.hero-copy { min-width: 0; }
.brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #99f6e4;
  border-radius: 999px;
  padding: 7px 12px;
  color: #0f766e;
  background: rgba(240, 253, 250, .92);
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 4px 14px rgba(13, 148, 136, .08);
}
.brand-pill-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,.12); }
.hero-title {
  margin-top: 22px;
  color: #134e4a;
  font-size: clamp(46px, 4.7vw, 62px);
  font-weight: 950;
  line-height: 1.04;
  letter-spacing: -.055em;
}
.hero-title > span { display: block; }
.hero-title-accent {
  margin-top: 5px;
  background: linear-gradient(100deg, #0d9488 0%, #14b8a6 55%, #0891b2 105%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero-description {
  max-width: 590px;
  margin-top: 24px;
  color: #5f6b7c;
  font-size: 17px;
  line-height: 1.85;
}
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.primary-action, .secondary-action {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border-radius: 13px;
  padding: 0 21px;
  font-size: 14px;
  font-weight: 850;
  text-decoration: none;
  transition: .2s ease;
}
.primary-action { color: #fff; background: #0d9488; box-shadow: 0 14px 30px rgba(13, 148, 136, .24); }
.primary-action:hover { transform: translateY(-2px); background: #0f766e; }
.secondary-action { border: 1px solid #dbe2ea; color: #334155; background: #fff; }
.secondary-action:hover { border-color: #99f6e4; color: #0f766e; background: #f0fdfa; }
.hero-trust-list { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 24px; }
.hero-trust-list li { display: flex; align-items: center; gap: 6px; color: #64748b; font-size: 11px; font-weight: 750; }
.hero-trust-list svg { color: #10b981; }

/* Service console */
.service-console {
  overflow: hidden;
  border: 1px solid #99f6e4;
  border-radius: 26px;
  color: #0f766e;
  background: linear-gradient(145deg, #fff 0%, #f0fdfa 58%, #ecfeff 100%);
  box-shadow: 0 32px 80px rgba(20, 184, 166, .16);
}
.console-topbar {
  display: flex;
  height: 48px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ccfbf1;
  padding: 0 18px;
  background: rgba(240, 253, 250, .9);
}
.console-window-dots { display: flex; gap: 6px; }
.console-window-dots span { width: 8px; height: 8px; border-radius: 50%; background: #334155; }
.console-window-dots span:first-child { background: #fb7185; }
.console-window-dots span:nth-child(2) { background: #fbbf24; }
.console-window-dots span:nth-child(3) { background: #34d399; }
.console-title { flex: 1; text-align: center; color: #5f807d; font-size: 10px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.console-live { display: inline-flex; align-items: center; gap: 6px; color: #6ee7b7; font-size: 10px; font-weight: 800; }
.console-live span { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 4px rgba(52,211,153,.1); }
.console-body { padding: 24px; }
.console-status-head { display: flex; align-items: center; justify-content: space-between; }
.console-status-head p { color: #5f807d; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.console-status-head h2 { margin-top: 6px; color: #134e4a; font-size: 23px; font-weight: 900; letter-spacing: -.035em; }
.health-orbit {
  position: relative;
  display: flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(52,211,153,.18);
  border-radius: 18px;
  color: #6ee7b7;
  background: rgba(16,185,129,.08);
}
.health-orbit > span { position: absolute; right: 7px; top: 7px; width: 7px; height: 7px; border-radius: 50%; background: #34d399; }
.request-list {
  display: grid;
  gap: 7px;
  margin-top: 21px;
}
.request-box {
  display: flex;
  align-items: center;
  gap: 11px;
  border: 1px solid #ccfbf1;
  border-radius: 12px;
  padding: 9px 13px;
  background: rgba(255,255,255,.88);
}
.request-method { border-radius: 6px; padding: 4px 7px; color: #6ee7b7; background: rgba(16,185,129,.1); font-size: 9px; font-weight: 900; }
.request-box code { min-width: 0; flex: 1; overflow: hidden; color: #315d58; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.request-box > span { color: #6f918d; font-size: 9px; font-weight: 700; }
.route-flow { display: grid; grid-template-columns: 1fr 55px 1fr 55px 1fr; align-items: center; margin-top: 22px; }
.route-node { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.route-node > span { display: flex; width: 42px; height: 42px; align-items: center; justify-content: center; border: 1px solid #99f6e4; border-radius: 13px; color: #0d9488; background: #fff; }
.route-node > span img { width: 28px; height: 28px; object-fit: contain; }
.route-node small { color: #5f807d; font-size: 9px; font-weight: 750; text-align: center; }
.route-node-primary > span { border-color: #5eead4; background: #f0fdfa; box-shadow: 0 0 24px rgba(20,184,166,.14); }
.route-node-primary small { color: #0d9488; }
.route-line { display: flex; align-items: center; color: #5eead4; }
.route-line span { height: 1px; flex: 1; background: linear-gradient(to right, #5eead4, #14b8a6); }
.console-event-list { margin-top: 22px; border-top: 1px solid #ccfbf1; }
.console-event { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e6fffb; padding: 11px 0; }
.event-check { display: flex; width: 22px; height: 22px; flex: none; align-items: center; justify-content: center; border-radius: 7px; color: #6ee7b7; background: rgba(16,185,129,.1); }
.console-event > div { display: flex; min-width: 0; flex: 1; flex-direction: column; }
.console-event strong { color: #285a55; font-size: 11px; font-weight: 800; }
.console-event small { margin-top: 2px; overflow: hidden; color: #6f918d; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
.event-status { color: #6ee7b7; font-size: 9px; font-weight: 800; }
.provider-row { display: flex; flex-wrap: wrap; gap: 7px; padding-top: 16px; }
.provider-row span { border: 1px solid #99f6e4; border-radius: 999px; padding: 5px 9px; color: #0f766e; background: #fff; font-size: 9px; font-weight: 750; }

/* Trust bar */
.trust-bar { border-top: 1px solid #edf0f5; border-bottom: 1px solid #edf0f5; background: #fff; }
.trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.trust-bar-item { display: flex; min-width: 0; align-items: center; gap: 12px; border-right: 1px solid #edf0f5; padding: 24px 20px; }
.trust-bar-item:last-child { border-right: 0; }
.trust-bar-icon { display: flex; width: 39px; height: 39px; flex: none; align-items: center; justify-content: center; border-radius: 12px; color: #0d9488; background: #f0fdfa; }
.trust-bar-item strong { display: block; color: #115e59; font-size: 12px; font-weight: 900; }
.trust-bar-item p { margin-top: 3px; color: #8490a2; font-size: 10px; line-height: 1.4; }

/* Shared sections */
.section { padding: 78px 0; scroll-margin-top: 72px; }

/* Ecosystem promo */
.ecosystem-section { background: #fff; }
.ecosystem-card {
  position: relative;
  display: grid;
  min-height: 292px;
  grid-template-columns: 260px 1fr auto;
  align-items: center;
  gap: 40px;
  overflow: hidden;
  border-radius: 28px;
  padding: 40px 46px 40px 30px;
  border: 1px solid #dbeafe;
  color: #115e59;
  background: linear-gradient(120deg, #ecfdf5 0%, #ecfeff 56%, #ccfbf1 125%);
  box-shadow: 0 28px 70px rgba(20,184,166,.15);
  text-decoration: none;
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.ecosystem-card:hover { transform: translateY(-3px); border-color: #5eead4; box-shadow: 0 30px 72px rgba(20,184,166,.17); }
.ecosystem-card:focus-visible { outline: 3px solid rgba(20,184,166,.28); outline-offset: 4px; }
.ecosystem-grid { position: absolute; inset: 0; opacity: .16; background-image: linear-gradient(rgba(20,184,166,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,.18) 1px, transparent 1px); background-size: 30px 30px; mask-image: linear-gradient(to right, #000, transparent 80%); }
.ecosystem-art { position: relative; height: 177px; }
.ecosystem-orbit { position: absolute; border: 1px solid rgba(20,184,166,.28); border-radius: 50%; }
.orbit-one { width: 150px; height: 150px; left: 35px; top: 13px; }
.orbit-two { width: 100px; height: 100px; left: 60px; top: 38px; }
.ecosystem-cube { position: absolute; display: flex; width: 68px; height: 68px; left: 76px; top: 54px; align-items: center; justify-content: center; border: 1px solid #99f6e4; border-radius: 22px; color: #0d9488; background: rgba(255,255,255,.72); box-shadow: 0 18px 45px rgba(20,184,166,.15); backdrop-filter: blur(10px); }
.ecosystem-copy { position: relative; z-index: 1; }
.ecosystem-eyebrow { color: #0d9488 !important; font-size: 11px !important; font-weight: 950; letter-spacing: .14em; text-transform: uppercase; }
.ecosystem-copy h2 { max-width: 720px; margin-top: 10px; color: #115e59; font-size: 36px; font-weight: 950; line-height: 1.2; letter-spacing: -.04em; }
.ecosystem-copy > p { max-width: 690px; margin-top: 15px; color: #4f746f; font-size: 14px; font-weight: 550; line-height: 1.8; }
.ecosystem-copy ul { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 21px; }
.ecosystem-copy li { border: 1px solid #5eead4; border-radius: 999px; padding: 7px 12px; color: #0f766e; background: rgba(255,255,255,.76); font-size: 10px; font-weight: 850; box-shadow: 0 5px 14px rgba(13,148,136,.06); }
.ecosystem-action { position: relative; z-index: 1; display: inline-flex; min-height: 52px; align-items: center; gap: 9px; border-radius: 14px; padding: 0 22px; color: #fff; background: linear-gradient(135deg, #14b8a6, #0d9488); font-size: 13px; font-weight: 900; text-decoration: none; white-space: nowrap; transition: .2s ease; box-shadow: 0 12px 26px rgba(13,148,136,.17); }
.ecosystem-card:hover .ecosystem-action { background: linear-gradient(135deg, #0d9488, #0f766e); }

/* Footer */
.site-footer { border-top: 1px solid #e8edf4; padding: 55px 0 28px; background: #fff; }
.footer-main { display: grid; grid-template-columns: 1.3fr 1fr 1fr; align-items: start; gap: 45px; }
.footer-brand { display: flex; gap: 13px; }
.footer-brand img { width: 100%; height: 100%; object-fit: contain; }
.footer-brand strong { font-size: 14px; font-weight: 900; }
.footer-brand p, .footer-contact p { max-width: 320px; margin-top: 6px; color: #8490a2; font-size: 10px; line-height: 1.6; }
.footer-nav > strong { color: #115e59; font-size: 11px; font-weight: 900; }
.footer-links { display: flex; flex-wrap: wrap; gap: 9px 18px; margin-top: 11px; }
.footer-links a { color: #64748b; font-size: 11px; font-weight: 750; text-decoration: none; }
.footer-links a:hover { color: #0d9488; }
.footer-contact strong { font-size: 11px; font-weight: 900; }
.footer-bottom { display: flex; justify-content: space-between; gap: 20px; margin-top: 38px; border-top: 1px solid #edf0f5; padding-top: 22px; color: #94a3b8; font-size: 9px; }

/* Floating support */
.support-dock { position: fixed; right: 18px; top: 50%; z-index: 50; transform: translateY(-50%); }
.support-dock summary { position: relative; display: flex; width: 58px; min-height: 68px; cursor: pointer; list-style: none; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border: 1px solid rgba(255,255,255,.4); border-radius: 19px; padding: 8px 5px; color: #fff; background: linear-gradient(145deg, #2dd4bf, #0d9488); font-size: 10px; font-weight: 850; box-shadow: 0 18px 42px rgba(20,184,166,.27); transition: .2s ease; }
.support-dock summary::-webkit-details-marker { display: none; }
.support-dock summary:hover { transform: translateY(-2px); background: #0d9488; }
.support-online { position: absolute; right: -2px; top: -2px; width: 11px; height: 11px; border: 2px solid #fff; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 4px rgba(52,211,153,.14); }
.support-panel { position: absolute; right: calc(100% + 13px); top: 50%; width: 335px; overflow: hidden; border: 1px solid #ccfbf1; border-radius: 22px; background: #fff; box-shadow: 0 25px 70px rgba(13,148,136,.18); transform: translateY(-50%); }
.support-head { display: flex; align-items: start; justify-content: space-between; gap: 15px; padding: 19px; color: #fff; background: linear-gradient(135deg, #14b8a6, #0d9488); }
.support-head strong { font-size: 13px; font-weight: 900; }
.support-head p { margin-top: 4px; color: #94a3b8; font-size: 9px; }
.support-head > span { display: flex; align-items: center; gap: 5px; border-radius: 999px; padding: 4px 7px; color: #6ee7b7; background: rgba(255,255,255,.08); font-size: 8px; font-weight: 800; }
.support-head i { width: 5px; height: 5px; border-radius: 50%; background: #34d399; }
.support-list { padding: 7px; }
.support-list a { display: flex; align-items: center; gap: 11px; border-radius: 14px; padding: 10px; color: #94a3b8; text-decoration: none; transition: .2s ease; }
.support-list a:hover { color: #0d9488; background: #f0fdfa; }
.support-logo { display: flex; width: 39px; height: 39px; flex: none; align-items: center; justify-content: center; border-radius: 12px; color: #fff; }
.support-logo svg { width: 18px; height: 18px; }
.support-telegram { background: #229ed9; }
.support-discord { background: #5865f2; }
.support-qq { background: #12b7f5; }
.qq-monogram { color: #fff; font-size: 11px; font-weight: 950; letter-spacing: -.06em; }
.support-list a > span:nth-child(2) { min-width: 0; flex: 1; }
.support-list strong { display: block; color: #115e59; font-size: 11px; font-weight: 850; }
.support-list small { display: block; margin-top: 2px; overflow: hidden; color: #94a3b8; font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }

.home-shell :deep(.home-locale button) { color: #475569; }
.home-shell :deep(.home-locale > div) { border-color: #e2e8f0; background: #fff; }

@media (max-width: 1023px) {
  .nav-links { display: none; }
  .hero-layout { grid-template-columns: 1fr; gap: 50px; }
  .hero-copy { max-width: 720px; }
  .service-console { max-width: 720px; }
  .trust-grid { grid-template-columns: repeat(2, 1fr); }
  .trust-bar-item:nth-child(2) { border-right: 0; }
  .trust-bar-item:nth-child(-n+2) { border-bottom: 1px solid #edf0f5; }
  .ecosystem-card { grid-template-columns: 190px 1fr; }
  .ecosystem-action { grid-column: 2; justify-self: start; }
}
@media (max-width: 640px) {
  .section-inner { padding-left: 16px; padding-right: 16px; }
  .home-nav { height: 64px; gap: 8px; }
  .brand-caption, .docs-link { display: none; }
  .brand-mark { width: 38px; height: 38px; }
  .brand-name { display: none; }
  .nav-actions { gap: 3px; }
  .header-action { min-height: 38px; padding: 0 13px; }
  .hero-section { padding: 65px 0 72px; }
  .hero-layout { gap: 40px; }
  .hero-title { font-size: 42px; }
  .hero-description { font-size: 15px; line-height: 1.75; }
  .hero-trust-list { gap: 9px 13px; }
  .console-body { padding: 18px; }
  .route-flow { grid-template-columns: 1fr 30px 1fr 30px 1fr; }
  .route-node small { font-size: 8px; }
  .request-box > span { display: none; }
  .trust-bar-item { padding: 18px 10px; }
  .trust-bar-icon { width: 34px; height: 34px; }
  .section { padding: 72px 0; }
  .ecosystem-card { min-height: auto; grid-template-columns: 1fr; gap: 15px; padding: 27px 24px; }
  .ecosystem-art { display: none; }
  .ecosystem-action { grid-column: 1; }
  .ecosystem-copy h2 { font-size: 28px; }
  .ecosystem-copy > p { font-size: 13px; }
  .footer-main { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; }
  .support-dock { right: 14px; top: auto; bottom: 14px; transform: none; }
  .support-dock summary { width: 50px; height: 50px; min-height: 50px; justify-content: center; padding: 0; border-radius: 50%; }
  .support-dock summary > span:last-child { display: none; }
  .support-panel { right: 0; top: auto; bottom: calc(100% + 12px); width: min(325px, calc(100vw - 28px)); transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .home-shell { scroll-behavior: auto; }
  .home-shell *, .home-shell *::before, .home-shell *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
