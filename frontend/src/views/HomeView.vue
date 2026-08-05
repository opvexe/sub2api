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

  <div v-else class="home-shell flex flex-col overflow-hidden bg-white text-gray-950">
    <header class="home-header z-40 flex-none bg-white">
      <nav
        class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        :aria-label="t('home.nav.primary')"
      >
        <router-link to="/home" class="flex min-w-0 items-center gap-3" :aria-label="siteName">
          <span class="brand-mark">
            <img
              :src="siteLogo || '/logo-v2.png'"
              :alt="`${siteName} logo`"
              class="h-full w-full object-contain"
            />
          </span>
          <span class="hidden truncate text-base font-black tracking-tight text-gray-950 sm:block">
            {{ siteName }}
          </span>
        </router-link>

        <div class="hidden items-center gap-3 text-sm font-bold text-gray-700 lg:flex">
          <span>{{ t('home.features.unifiedGateway') }}</span>
          <span class="nav-dot" aria-hidden="true"></span>
          <span>{{ t('home.preview.smartRouting') }}</span>
          <span class="nav-dot" aria-hidden="true"></span>
          <span>{{ t('home.preview.billing') }}</span>
        </div>

        <div class="flex flex-none items-center gap-1.5 sm:gap-2.5">
          <a
            v-if="docUrl"
            :href="docUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden min-h-9 items-center rounded-full px-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 sm:inline-flex"
          >
            {{ t('home.docs') }}
          </a>
          <LocaleSwitcher class="home-locale" />
          <router-link
            :to="isAuthenticated ? dashboardPath : '/login'"
            class="header-action"
          >
            {{ isAuthenticated ? t('home.dashboard') : t('home.login') }}
          </router-link>
        </div>
      </nav>
    </header>

    <main class="min-h-0 flex-1 overflow-hidden">
      <div class="home-grid">
        <section class="hero-panel min-w-0">
          <div class="hero-copy">
            <div class="product-pill">
              <span class="h-2 w-2 rounded-full bg-primary-500" aria-hidden="true"></span>
              {{ siteSubtitle }}
            </div>

            <h1 class="hero-title">
              <span>{{ t('home.heroTitleLead') }}</span>
              <span class="accent-title">{{ t('home.heroTitleAccent') }}</span>
            </h1>

            <p class="hero-description">
              {{ t('home.heroDescription') }}
            </p>

            <div class="hero-actions">
              <router-link
                :to="isAuthenticated ? dashboardPath : '/login'"
                class="primary-action"
              >
                {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
                <Icon name="arrowRight" size="sm" :stroke-width="2.5" aria-hidden="true" />
              </router-link>
              <a
                v-if="docUrl"
                :href="docUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="secondary-action"
              >
                {{ t('home.viewDocs') }}
                <Icon name="externalLink" size="sm" :stroke-width="2" aria-hidden="true" />
              </a>
            </div>

            <ul class="hero-tags" :aria-label="t('home.highlights')">
              <li>{{ t('home.preview.oneKey') }}</li>
              <li>{{ t('home.preview.failover') }}</li>
              <li>{{ t('home.preview.billing') }}</li>
            </ul>
          </div>

          <article class="volume-card">
            <div class="flex min-w-0 items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-2">
                <span class="metric-icon">
                  <Icon name="chart" size="sm" :stroke-width="2.2" aria-hidden="true" />
                </span>
                <span class="truncate text-sm font-black text-gray-900">
                  {{ t('home.liveMetrics.title') }}
                </span>
              </div>
              <span class="live-pill">
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true"></span>
                {{ t('home.liveMetrics.live') }}
              </span>
            </div>

            <div class="mt-3 flex min-w-0 items-end justify-between gap-4 sm:mt-4">
              <div class="min-w-0">
                <p class="volume-number">128,764,392</p>
                <p class="volume-caption">{{ t('home.liveMetrics.unit') }}</p>
              </div>
              <div class="metric-spark" aria-hidden="true">
                <span class="h-[32%]"></span>
                <span class="h-[46%]"></span>
                <span class="h-[39%]"></span>
                <span class="h-[62%]"></span>
                <span class="h-[55%]"></span>
                <span class="h-[78%]"></span>
                <span class="h-[68%]"></span>
                <span class="h-full"></span>
              </div>
            </div>
          </article>
        </section>

        <aside class="status-card min-w-0" :aria-label="t('home.modelStatus.title')">
          <div class="status-header">
            <div class="flex min-w-0 items-center gap-3">
              <span class="status-header-icon">
                <Icon name="server" size="md" :stroke-width="2" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <h2 class="truncate text-lg font-black text-gray-950">
                  {{ t('home.modelStatus.title') }}
                </h2>
                <p class="status-description mt-0.5 truncate text-xs text-gray-500">
                  {{ t('home.modelStatus.description') }}
                </p>
              </div>
            </div>
            <span class="all-status-pill">
              <span class="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
              {{ t('home.modelStatus.allOperational') }}
            </span>
          </div>

          <div class="status-summary">
            <div>
              <span>{{ t('home.preview.oneKey') }}</span>
              <strong>1</strong>
            </div>
            <div>
              <span>{{ t('home.providers.title') }}</span>
              <strong>4+</strong>
            </div>
            <div>
              <span>{{ t('home.preview.billing') }}</span>
              <strong>{{ t('home.tags.realtimeBilling') }}</strong>
            </div>
          </div>

          <div class="gateway-strip">
            <div class="flex min-w-0 items-center gap-3">
              <span class="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <Icon name="terminal" size="sm" :stroke-width="2" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <p class="text-[11px] font-bold text-gray-500">{{ t('home.features.endpoint') }}</p>
                <p class="truncate font-mono text-sm font-bold text-gray-900">POST /v1/messages</p>
              </div>
            </div>
            <span class="route-pill">{{ t('home.preview.auto') }}</span>
          </div>

          <ul class="model-list">
            <li class="model-row">
              <span class="model-mark bg-orange-50 text-orange-700">C</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-black text-gray-900">Claude Sonnet</p>
                <p class="model-meta">Anthropic · Messages</p>
              </div>
              <span class="model-status">
                <span></span>
                {{ t('home.modelStatus.operational') }}
              </span>
            </li>
            <li class="model-row">
              <span class="model-mark bg-gray-100 text-gray-700">G</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-black text-gray-900">GPT</p>
                <p class="model-meta">OpenAI · Responses</p>
              </div>
              <span class="model-status">
                <span></span>
                {{ t('home.modelStatus.operational') }}
              </span>
            </li>
            <li class="model-row">
              <span class="model-mark bg-blue-50 text-blue-700">G</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-black text-gray-900">Gemini Pro</p>
                <p class="model-meta">Google · GenerateContent</p>
              </div>
              <span class="model-status">
                <span></span>
                {{ t('home.modelStatus.operational') }}
              </span>
            </li>
            <li class="model-row">
              <span class="model-mark bg-primary-50 text-primary-700">A</span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-black text-gray-900">Antigravity</p>
                <p class="model-meta">Google · Cloud Code</p>
              </div>
              <span class="model-status">
                <span></span>
                {{ t('home.modelStatus.operational') }}
              </span>
            </li>
          </ul>

          <div class="status-footer">
            <span>{{ t('home.features.openaiCompatible') }}</span>
            <span>Anthropic Messages</span>
            <span>{{ t('home.preview.smartRouting') }}</span>
          </div>
        </aside>
      </div>
    </main>
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

const siteName = computed(() =>
  normalizeSiteName(
    appStore.cachedPublicSettings?.site_name ||
    appStore.siteName ||
    ''
  )
)
const siteLogo = computed(() =>
  sanitizeUrl(appStore.cachedPublicSettings?.site_logo || appStore.siteLogo || '', {
    allowRelative: true,
    allowDataUrl: true
  })
)
const siteSubtitle = computed(() => {
  const configuredSubtitle = appStore.cachedPublicSettings?.site_subtitle?.trim()
  const defaultSubtitles = ['AI API Gateway Platform', 'Subscription to API Conversion Platform']
  return configuredSubtitle && !defaultSubtitles.includes(configuredSubtitle)
    ? configuredSubtitle
    : t('home.productTagline')
})
const docUrl = computed(() =>
  sanitizeUrl(appStore.cachedPublicSettings?.doc_url || appStore.docUrl || '')
)
const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')
const hasHomeContent = computed(() => homeContent.value.trim().length > 0)
const compactHomeEnabled = computed(() => appStore.cachedPublicSettings?.compact_home_enabled === true)
const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const dashboardPath = computed(() => (authStore.isAdmin ? '/admin/dashboard' : '/dashboard'))
const currentYear = computed(() => new Date().getFullYear())

// Theme (used by the compact home page)
const isDark = ref(document.documentElement.classList.contains('dark'))

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}

onMounted(() => {
  initTheme()
  authStore.checkAuth()
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
.home-shell {
  height: 100svh;
  min-height: 620px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
    "PingFang SC", "Hiragino Sans GB", system-ui, "Helvetica Neue", Arial, sans-serif;
}

.home-header {
  border-bottom: 1px solid #e5e5e7;
}

.brand-mark {
  @apply flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-[10px] border border-gray-200 bg-white;
}

.nav-dot {
  @apply h-1 w-1 rounded-full bg-gray-300;
}

.header-action {
  @apply inline-flex min-h-9 items-center justify-center rounded-full border border-transparent bg-gray-900 px-4 text-sm font-semibold text-white transition;
}

.header-action:hover {
  @apply bg-gray-700;
}

.home-grid {
  @apply mx-auto grid h-full min-h-0 w-full max-w-7xl gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-7 lg:px-8 lg:py-6;
}

.hero-panel {
  @apply flex min-h-0 flex-col justify-center;
}

.product-pill {
  @apply inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600;
}

.hero-title {
  @apply mt-4 max-w-xl text-[34px] font-bold leading-[1.08] tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-[58px];
}

.accent-title {
  @apply relative z-0 mt-1 block w-fit text-gray-950;
}

.accent-title::after {
  content: none;
}

.hero-description {
  @apply mt-4 max-w-xl text-sm font-normal leading-6 text-[#6e6e73] sm:text-base sm:leading-7 lg:text-lg;
}

.hero-actions {
  @apply mt-4 flex items-center gap-3 sm:mt-5;
}

.primary-action,
.secondary-action {
  @apply inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-12 sm:text-base;
}

.primary-action {
  @apply bg-[#0071e3] text-white;
}

.primary-action:hover,
.secondary-action:hover {
  @apply no-underline;
}

.primary-action:hover {
  @apply bg-[#0077ed];
}

.secondary-action {
  @apply hidden border-gray-200 bg-white text-[#0066cc] sm:inline-flex;
}

.secondary-action:hover {
  @apply bg-gray-50;
}

.hero-tags {
  @apply mt-4 flex flex-wrap items-center gap-x-3 gap-y-1;
}

.hero-tags li {
  @apply relative text-[11px] font-medium text-gray-500;
}

.hero-tags li + li {
  @apply pl-3;
}

.hero-tags li + li::before {
  content: '';
  @apply absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-gray-300;
}

.volume-card,
.status-card {
  @apply border border-[#e5e5e7];
  box-shadow: none;
}

.volume-card {
  @apply mt-4 min-w-0 rounded-2xl bg-white p-4 sm:mt-5 sm:rounded-3xl sm:p-5;
}

.metric-icon {
  @apply flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#f5f5f7] text-gray-700;
}

.live-pill,
.all-status-pill {
  @apply inline-flex flex-none items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700;
}

.volume-number {
  @apply whitespace-nowrap text-[34px] font-bold tabular-nums tracking-[-0.045em] text-[#1d1d1f] sm:text-5xl lg:text-[52px];
}

.volume-caption {
  @apply mt-0.5 truncate text-[11px] font-bold text-gray-500 sm:mt-1 sm:text-xs;
}

.metric-spark {
  @apply hidden h-14 w-36 flex-none items-end gap-1.5 sm:flex;
}

.metric-spark span {
  @apply min-w-0 flex-1 rounded-t-md bg-blue-200;
}

.metric-spark span:last-child {
  @apply bg-[#0071e3];
}

.status-card {
  @apply min-h-0 overflow-hidden rounded-2xl bg-white sm:rounded-3xl;
}

.status-header {
  @apply flex items-center justify-between gap-3 border-b border-[#e5e5e7] px-4 py-3 sm:px-5 sm:py-4;
}

.status-header-icon {
  @apply flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#f5f5f7] text-gray-800;
}

.status-summary {
  @apply hidden grid-cols-3 border-b border-[#e5e5e7] bg-white px-3 py-2 sm:grid sm:px-4 sm:py-3;
}

.status-summary div {
  @apply flex min-w-0 flex-col bg-white px-3 py-1.5;
}

.status-summary div + div {
  @apply border-l border-gray-200;
}

.status-summary span {
  @apply truncate text-[11px] font-bold text-gray-500;
}

.status-summary strong {
  @apply mt-1 truncate text-sm font-black text-gray-900;
}

.gateway-strip {
  @apply hidden items-center justify-between gap-3 border-b border-[#e5e5e7] bg-white px-4 py-3 sm:flex sm:px-5;
}

.route-pill {
  @apply flex-none rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[11px] font-semibold text-gray-600;
}

.model-list {
  @apply divide-y divide-gray-200 px-4 sm:px-5;
}

.model-row {
  @apply flex min-w-0 items-center gap-3 py-2.5 sm:py-3;
}

.model-mark {
  @apply flex h-8 w-8 flex-none items-center justify-center rounded-lg border-0 text-[11px] font-semibold sm:h-9 sm:w-9;
  background: #f5f5f7 !important;
  color: #424245 !important;
}

.model-meta {
  @apply mt-0.5 hidden truncate text-[11px] font-medium text-gray-500 sm:block;
}

.model-status {
  @apply inline-flex flex-none items-center gap-1.5 text-[11px] font-semibold text-emerald-700;
}

.model-status span {
  @apply h-1.5 w-1.5 rounded-full bg-emerald-500;
}

.status-footer {
  @apply hidden flex-wrap gap-2 border-t border-[#e5e5e7] bg-white px-5 py-3 lg:flex;
}

.status-footer span {
  @apply rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-medium text-gray-500;
}

.home-shell :deep(.home-locale button) {
  color: #374151;
}

.home-shell :deep(.home-locale > div) {
  border-color: #d1d5db;
  background: #ffffff;
}

@media (min-width: 1024px) {
  .status-card {
    max-height: min(610px, calc(100svh - 112px));
  }
}

@media (max-width: 1023px) and (max-height: 720px) {
  .home-grid {
    gap: 0.5rem;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
  }

  .product-pill {
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
  }

  .hero-title {
    margin-top: 0.65rem;
    font-size: 30px;
  }

  .hero-description,
  .hero-tags,
  .status-description {
    display: none;
  }

  .hero-actions,
  .volume-card {
    margin-top: 0.65rem;
  }

  .volume-card {
    padding: 0.75rem;
  }

  .status-header {
    padding-bottom: 0.55rem;
    padding-top: 0.55rem;
  }

  .model-row {
    padding-bottom: 0.45rem;
    padding-top: 0.45rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-shell *,
  .home-shell *::before,
  .home-shell *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
