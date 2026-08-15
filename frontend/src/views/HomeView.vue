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

  <!-- OriginCoder brand home -->
  <div v-else class="home-shell">
    <header class="home-header">
      <nav class="section-inner home-nav" :aria-label="t('home.nav.primary')">
        <router-link to="/home" class="brand-link" :aria-label="siteName">
          <span class="brand-mark">
            <img :src="brandLogo" :alt="siteName + ' logo'" />
          </span>
          <strong class="brand-name">OriginCoder</strong>
        </router-link>

        <div class="nav-actions">
          <span class="nav-links">
            <router-link v-if="modelPlazaEnabled" to="/model-plaza">
              {{ t('home.landing.nav.models') }}
            </router-link>
            <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">
              {{ t('home.landing.nav.docs') }}
            </a>
          </span>
          <LocaleSwitcher class="home-locale" />
          <button
            type="button"
            class="theme-toggle"
            :title="isDark ? t('home.switchToLight') : t('home.switchToDark')"
            :aria-label="isDark ? t('home.switchToLight') : t('home.switchToDark')"
            @click="toggleTheme"
          >
            <Icon :name="isDark ? 'sun' : 'moon'" size="sm" :stroke-width="2" />
          </button>
          <router-link :to="isAuthenticated ? dashboardPath : '/register'" class="btn btn-p">
            {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
          </router-link>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero -->
      <section class="hero">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="hero-grid" aria-hidden="true"></div>
        <div class="section-inner hero-inner">
          <div class="hero-badge-row">
            <span class="hero-badges">
              <span aria-hidden="true">✦</span>
              {{ t('home.landing.hero.badgeCompatible') }}
              <i></i>{{ t('home.landing.hero.badgeUsd') }}
              <i></i>{{ t('home.landing.hero.badgeCancel') }}
            </span>
            <span class="hero-badges hero-badges-hl">
              <b aria-hidden="true"></b>
              {{ t('home.landing.hero.badgeFable') }}
            </span>
          </div>

          <h1 class="hero-title">
            {{ t('home.landing.hero.headline') }}
            <span>{{ t('home.landing.hero.headlineAccent') }}</span>
          </h1>
          <p class="hero-lead">{{ t('home.landing.hero.lead') }}</p>

          <div class="hero-cta">
            <router-link :to="pricingEntry" class="btn btn-p btn-lg">
              {{ t('home.landing.hero.ctaPrimary') }}
              <Icon name="arrowRight" size="sm" :stroke-width="2.4" aria-hidden="true" />
            </router-link>
            <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer" class="btn btn-g btn-lg">
              {{ t('home.landing.hero.ctaSecondary') }}
            </a>
            <a v-else href="#developers" class="btn btn-g btn-lg">
              {{ t('home.landing.hero.ctaSecondary') }}
            </a>
          </div>

          <ul class="chips" :aria-label="t('home.landing.nav.models')">
            <li v-for="name in modelChips" :key="name">{{ name }}</li>
          </ul>

          <dl class="stats">
            <div v-for="stat in heroStats" :key="stat.key">
              <dt>{{ stat.value }}</dt>
              <dd>{{ stat.label }}</dd>
            </div>
          </dl>
        </div>
      </section>

      <!-- Popular paths -->
      <section id="paths" class="sec"><div class="section-inner">
        <div class="sec-head">
          <p class="eyebrow">{{ t('home.landing.paths.eyebrow') }}</p>
          <h2 class="big">{{ t('home.landing.paths.title') }}</h2>
          <p class="lead">{{ t('home.landing.paths.lead') }}</p>
        </div>
        <div class="grid4">
          <article v-for="path in pathCards" :key="path.key" class="card">
            <span class="card-ic"><Icon :name="path.icon" size="sm" :stroke-width="2" /></span>
            <b>{{ path.title }}</b>
            <p>{{ path.desc }}</p>
            <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer" class="card-go">
              {{ t('home.landing.paths.action') }} →
            </a>
            <a v-else href="#developers" class="card-go">{{ t('home.landing.paths.action') }} →</a>
          </article>
        </div>
      </div></section>

      <!-- Developer first -->
      <section id="developers" class="sec"><div class="section-inner dev">
        <div>
          <p class="eyebrow">{{ t('home.landing.developer.eyebrow') }}</p>
          <h2 class="big">
            {{ t('home.landing.developer.title') }}
            <span>{{ t('home.landing.developer.titleAccent') }}</span>
          </h2>
          <p class="lead">{{ t('home.landing.developer.lead') }}</p>
          <div class="dev-list">
            <div v-for="item in devItems" :key="item.key" class="dev-item">
              <span class="dev-ic"><Icon :name="item.icon" size="sm" :stroke-width="2" /></span>
              <div><b>{{ item.title }}</b><p>{{ item.desc }}</p></div>
            </div>
          </div>
        </div>
        <div class="code-card">
          <div class="code-top">
            <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="code-label">{{ t('home.landing.developer.codeLabel') }}</span>
            <button type="button" class="code-copy" @click="copySnippet(curlSnippet, 'curl')">
              <Icon :name="copiedKey === 'curl' ? 'check' : 'copy'" size="xs" :stroke-width="2.2" />
              {{ copiedKey === 'curl' ? t('home.landing.developer.copied') : t('home.landing.developer.copy') }}
            </button>
          </div>
          <pre class="code-body"><code>{{ curlSnippet }}</code></pre>
        </div>
      </div></section>

      <!-- Architecture -->
      <section id="architecture" class="sec"><div class="section-inner">
        <p class="eyebrow">{{ t('home.landing.architecture.eyebrow') }}</p>
        <div class="arch">
          <div class="panel">
            <div class="panel-head">
              <span class="panel-title">{{ t('home.landing.architecture.lifecycle') }}</span>
              <span class="pill"><i></i>{{ t('home.landing.architecture.active') }}</span>
            </div>
            <div class="panel-body">
              <div v-for="(step, index) in archSteps" :key="step.key" class="step">
                <span class="step-n">{{ index + 1 }}</span>
                <div><b>{{ step.title }}</b><p>{{ step.desc }}</p></div>
              </div>
              <div class="bignum">
                <b>{{ t('home.landing.architecture.delivered.value') }}</b>
                <div>
                  <p>{{ t('home.landing.architecture.delivered.title') }}</p>
                  <p>{{ t('home.landing.architecture.delivered.desc') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <span class="eyebrow">{{ t('home.landing.architecture.formats') }}</span>
              <span class="pill"><i></i>{{ t('home.landing.architecture.autoDetected') }}</span>
            </div>
            <div class="fmt-list">
              <div v-for="format in requestFormats" :key="format.key" class="endpoint-row">
                <span class="endpoint-method">POST</span>
                <code>{{ format.endpoint }}</code>
                <small>{{ format.label }}</small>
              </div>
            </div>
            <p class="panel-note">{{ t('home.landing.architecture.formatsNote') }}</p>
            <div class="panel-body" style="padding-top: 0">
              <div class="bignum" style="margin-top: 0">
                <b>{{ t('home.landing.architecture.formatsCount.value') }}</b>
                <div>
                  <p>{{ t('home.landing.architecture.formatsCount.title') }}</p>
                  <p>{{ t('home.landing.architecture.formatsCount.desc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></section>

      <!-- Final CTA -->
      <section class="sec sec-flush"><div class="section-inner">
        <div class="final">
          <p class="eyebrow">{{ t('home.landing.finalCta.eyebrow') }}</p>
          <h2 class="big">{{ t('home.landing.finalCta.title') }}</h2>
          <p class="lead">{{ t('home.landing.finalCta.lead') }}</p>
          <div class="hero-cta">
            <router-link :to="isAuthenticated ? dashboardPath : '/register'" class="btn btn-p btn-lg">
              {{ t('home.landing.finalCta.primary') }}
              <Icon name="arrowRight" size="sm" :stroke-width="2.4" aria-hidden="true" />
            </router-link>
            <a :href="supportLinks[0]?.href" target="_blank" rel="noopener noreferrer" class="btn btn-g btn-lg">
              {{ t('home.landing.finalCta.secondary') }}
            </a>
          </div>
        </div>
      </div></section>
    </main>

    <footer class="site-footer">
      <div class="section-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <router-link to="/home" class="brand-link" :aria-label="siteName">
              <span class="brand-mark"><img :src="brandLogo" :alt="siteName + ' logo'" /></span>
              <strong class="brand-name">OriginCoder</strong>
            </router-link>
            <p>{{ t('home.landing.footer.brandDesc') }}</p>
            <a class="footer-mail" :href="`mailto:${SUPPORT_EMAIL}`">{{ SUPPORT_EMAIL }}</a>
          </div>

          <nav class="footer-col" :aria-label="t('home.landing.footer.product')">
            <strong>{{ t('home.landing.footer.product') }}</strong>
            <router-link v-if="modelPlazaEnabled" to="/model-plaza">
              {{ t('home.landing.footer.models') }}
            </router-link>
            <router-link to="/purchase">{{ t('home.landing.footer.pricing') }}</router-link>
            <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">
              {{ t('home.landing.footer.docs') }}
            </a>
            <router-link :to="isAuthenticated ? dashboardPath : '/login'">
              {{ t('home.landing.footer.console') }}
            </router-link>
          </nav>

          <nav class="footer-col footer-col--support" :aria-label="t('home.landing.footer.support')">
            <strong>{{ t('home.landing.footer.support') }}</strong>
            <a :href="`mailto:${SUPPORT_EMAIL}`">{{ t('home.landing.footer.contact') }}</a>
            <a
              v-for="channel in supportLinks"
              :key="channel.key"
              :href="channel.href"
              target="_blank"
              rel="noopener noreferrer"
            >{{ channel.label }} ↗</a>
          </nav>

          <nav v-if="legalDocuments.length" class="footer-col" :aria-label="t('home.landing.footer.legal')">
            <strong>{{ t('home.landing.footer.legal') }}</strong>
            <router-link v-for="doc in legalDocuments" :key="doc.id" :to="`/legal/${doc.id}`">
              {{ doc.title }}
            </router-link>
          </nav>
          <div v-else class="footer-col">
            <strong>{{ t('home.footer.contact') }}</strong>
            <p class="footer-note">{{ contactInfo || t('home.footer.contactDescription') }}</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-legal">{{ t('home.landing.footer.disclaimer') }}</p>
          <div class="footer-meta">
            <span>&copy; {{ currentYear }} OriginCoder. {{ t('home.footer.allRightsReserved') }}</span>
            <span class="footer-tags"><i>USD</i><i>Stripe</i><i>USDT</i></span>
          </div>
        </div>
      </div>
    </footer>

    <!-- 悬浮客服：默认只露一个按钮，点开才展示渠道；渠道始终在 DOM 里，只切换可见性 -->
    <div class="support-dock">
      <div v-show="supportOpen" id="support-panel" class="support-panel">
        <div class="panel-head">
          <strong>{{ t('home.community.title') }}</strong>
          <button
            type="button"
            class="panel-close"
            :aria-label="t('home.community.close')"
            @click="supportOpen = false"
          >
            <Icon name="x" size="sm" :stroke-width="2" />
          </button>
        </div>
        <p class="panel-hours">
          <Icon name="clock" size="sm" :stroke-width="2" aria-hidden="true" />
          {{ t('home.community.hours') }}
        </p>
        <nav class="support-rail" :aria-label="t('home.community.title')">
          <a
            v-for="channel in supportLinks"
            :key="channel.key"
            :href="channel.href"
            target="_blank"
            rel="noopener noreferrer"
            class="rail-item"
            :class="'rail-' + channel.key"
          >
            <span class="rail-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="channel.path" /></svg>
            </span>
            <span class="rail-label">
              <strong>{{ channel.label }}</strong>
              <small>{{ t(`home.community.${channel.key}Description`) }}</small>
            </span>
          </a>
        </nav>
      </div>

      <button
        type="button"
        class="support-fab"
        :class="{ 'is-open': supportOpen }"
        :aria-expanded="supportOpen"
        aria-controls="support-panel"
        @click="supportOpen = !supportOpen"
      >
        <Icon :name="supportOpen ? 'x' : 'chat'" size="sm" :stroke-width="2.2" />
        <span>{{ t('home.community.support') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useAppStore } from '@/stores'
import LocaleSwitcher from '@/components/common/LocaleSwitcher.vue'
import Icon from '@/components/icons/Icon.vue'
import { useClipboard } from '@/composables/useClipboard'
import { normalizeSiteName } from '@/utils/branding'
import { applyHomeSeo } from '@/utils/seo'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()
const authStore = useAuthStore()
const appStore = useAppStore()
const BRAND_LOGO_URL = '/logo-v2.png?v=brand-20260815'
// 标记是单色的：近黑框在深色底上会看不见，所以按主题换文件。
const BRAND_LOGO_URL_DARK = '/logo-v2-dark.png?v=brand-20260815'

// 留空的客服渠道不会展示。
const CONTACT = {
  telegram: 'https://t.me/origincoder998',
  discord: 'https://discord.gg/2C6Qvd36pq',
}
const SUPPORT_EMAIL = 'support@origincoder.com'

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

// 协议文档由管理员在后台配置；没有配置时 footer 改显示联系方式。
const legalDocuments = computed(() =>
  (appStore.cachedPublicSettings?.login_agreement_documents || []).filter(
    (doc) => doc?.id && doc?.title
  )
)

// 模型广场可被管理员关闭；关闭时相关入口会被路由守卫打回首页，所以直接不展示。
const modelPlazaEnabled = computed(
  () => appStore.cachedPublicSettings?.model_plaza_enabled !== false
)
// 广场关闭时，"看价格"的落点退回套餐页。
const pricingEntry = computed(() => (modelPlazaEnabled.value ? '/model-plaza' : '/purchase'))

const modelChips = ['Claude', 'GPT', 'Gemini', 'DeepSeek', 'Grok', 'Qwen', 'Llama', 'Mistral']

const heroStats = computed(() => [
  {
    key: 'models',
    value: t('home.landing.hero.stats.modelsValue'),
    label: t('home.landing.hero.stats.modelsLabel'),
  },
  {
    key: 'uptime',
    value: t('home.landing.hero.stats.uptimeValue'),
    label: t('home.landing.hero.stats.uptimeLabel'),
  },
  {
    key: 'one',
    value: t('home.landing.hero.stats.oneValue'),
    label: t('home.landing.hero.stats.oneLabel'),
  },
])

const PATH_SLOTS = [
  { key: 'agents', icon: 'cpu' },
  { key: 'chat', icon: 'chat' },
  { key: 'cli', icon: 'terminal' },
  { key: 'apps', icon: 'cube' },
] as const
const pathCards = computed(() =>
  PATH_SLOTS.map((slot) => ({
    ...slot,
    title: t('home.landing.paths.' + slot.key + '.title'),
    desc: t('home.landing.paths.' + slot.key + '.desc'),
  }))
)

const DEV_SLOTS = [
  { key: 'endpoints', icon: 'bolt' },
  { key: 'failover', icon: 'arrowsUpDown' },
  { key: 'protocol', icon: 'sparkles' },
  { key: 'records', icon: 'document' },
] as const
const devItems = computed(() =>
  DEV_SLOTS.map((slot) => ({
    ...slot,
    title: t('home.landing.developer.' + slot.key + '.title'),
    desc: t('home.landing.developer.' + slot.key + '.desc'),
  }))
)

const ARCH_SLOTS = ['step1', 'step2', 'step3'] as const
const archSteps = computed(() =>
  ARCH_SLOTS.map((key) => ({
    key,
    title: t('home.landing.architecture.' + key + '.title'),
    desc: t('home.landing.architecture.' + key + '.desc'),
  }))
)

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

const curlSnippet = `curl -X POST https://origincoder.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "claude-sonnet-4-5",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'`

const copiedKey = ref('')
let copyTimer: ReturnType<typeof setTimeout> | undefined
async function copySnippet(text: string, key: string) {
  // 延迟到点击时再取：useClipboard 依赖 appStore，setup 阶段取会要求测试环境装 Pinia。
  const { copyToClipboard } = useClipboard()
  const ok = await copyToClipboard(text)
  if (!ok) return
  copiedKey.value = key
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => (copiedKey.value = ''), 2000)
}

const supportLinks = computed(() =>
  [
    { key: 'telegram', href: CONTACT.telegram, label: 'Telegram', path: TELEGRAM_PATH },
    { key: 'discord', href: CONTACT.discord, label: 'Discord', path: DISCORD_PATH },
  ].filter((item) => item.href)
)

const supportOpen = ref(false)

// Theme
const isDark = ref(document.documentElement.classList.contains('dark'))
const brandLogo = computed(() => (isDark.value ? BRAND_LOGO_URL_DARK : BRAND_LOGO_URL))
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
  applyHomeSeo({
    siteName: siteName.value,
    description: t('home.landing.hero.lead'),
    logoUrl: siteLogo.value || BRAND_LOGO_URL,
  })
})
</script>

<style scoped>
/*
 * 奶油橙主题：暖白底（#faf9f5）+ 橙色主按钮（#d97757），文字用暖中性灰。
 * 小字用 --accent-text（更深一档）保证 4.5:1，大字/图标才用 --accent。
 * 分区之间不画分割线，只靠留白。
 */
.home-shell {
  /* 奶油橙：暖白底 + Claude 橙主色，中性文字走暖灰而非冷灰 */
  --bg: #faf9f5;
  --surface: #ffffff;
  --surface-2: #f4efe4;
  --border: rgba(25, 24, 23, .10);
  --border-2: rgba(25, 24, 23, .20);
  --fg: #191817;
  --muted: #6f6a60;
  --dim: #746f66;
  --accent: #b6522c;
  --accent-text: #a04a29;
  --accent-soft: #f7ece2;
  --accent-line: rgba(217, 119, 87, .30);
  --primary: #d97757;
  --primary-hover: #c4643f;
  --primary-fg: #ffffff;
  --glass: rgba(250, 249, 245, .85);
  --shadow: 0 1px 2px rgba(25, 24, 23, .05);
  --r: 14px;

  min-height: 100vh;
  overflow-x: hidden;
  color: var(--fg);
  background: var(--bg);
  font-size: 15px;
  letter-spacing: -.006em;
}
html.dark .home-shell {
  /* 深色同样走暖中性，橙色提亮一档保证在深底上的对比度 */
  --bg: #1a1917;
  --surface: #232220;
  --surface-2: #2c2a27;
  --border: #35322e;
  --border-2: #454037;
  --fg: #f5f4f0;
  --muted: #a8a29a;
  --dim: #a8a29a;
  --accent: #e08a68;
  --accent-text: #e8a184;
  --accent-soft: rgba(217, 119, 87, .16);
  --accent-line: rgba(217, 119, 87, .32);
  --primary: #d97757;
  --primary-hover: #e08a68;
  --primary-fg: #1a1917;
  --glass: rgba(26, 25, 23, .84);
  --shadow: 0 1px 2px rgba(0, 0, 0, .4);

}

.section-inner { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 28px; }
.eyebrow { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-text); }
.big { font-size: clamp(28px, 3.4vw, 44px); font-weight: 800; letter-spacing: -.035em; line-height: 1.1; }
.lead { margin-top: 14px; color: var(--muted); font-size: 15.5px; line-height: 1.7; max-width: 680px; }
.sec { padding: 56px 0; }

.sec-head { text-align: center; max-width: 680px; margin: 0 auto; }
.sec-head .lead { margin-left: auto; margin-right: auto; }

/* Header */
.home-header {
  position: sticky;
  top: 0;
  z-index: 90;
  border-bottom: 1px solid var(--border);
  background: var(--glass);
  backdrop-filter: blur(14px);
}
.home-nav { display: flex; align-items: center; height: 62px; gap: 28px; }
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
.nav-links { display: flex; align-items: center; gap: 24px; margin-right: 8px; }
.nav-links a { color: var(--muted); font-size: 14px; text-decoration: none; }
.nav-links a:hover { color: var(--fg); }
.nav-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.theme-toggle {
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  color: var(--muted);
  background: transparent;
  cursor: pointer;
}
.theme-toggle:hover { color: var(--fg); background: var(--surface-2); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 0 17px;
  min-height: 38px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background .16s ease, border-color .16s ease;
}
.btn-p { background: var(--primary); color: var(--primary-fg); }
.btn-p:hover { background: var(--primary-hover); }
.btn-g { background: var(--surface-2); border-color: var(--border); color: var(--fg); }
.btn-g:hover { border-color: var(--border-2); }
.btn-lg { min-height: 46px; padding: 0 24px; font-size: 15px; }

/* Hero */
.hero { position: relative; padding: 80px 0 60px; text-align: center; overflow: hidden; }
.hero-glow {
  position: absolute;
  left: 50%;
  top: -260px;
  width: 1000px;
  height: 620px;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, rgba(217, 119, 87, .20), transparent 72%);
  pointer-events: none;
}
html.dark .hero-glow { background: radial-gradient(closest-side, rgba(217, 119, 87, .18), transparent 72%); }
.hero-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(25, 24, 23, .05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(25, 24, 23, .05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 62% 55% at 50% 18%, #000, transparent 76%);
  -webkit-mask-image: radial-gradient(ellipse 62% 55% at 50% 18%, #000, transparent 76%);
}
html.dark .hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, .025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .025) 1px, transparent 1px);
}
.hero-inner { position: relative; }
.hero-badges {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 7px 16px;
  background: var(--surface-2);
  font-size: 12.5px;
  color: var(--muted);
}
.hero-badges i { width: 3px; height: 3px; border-radius: 50%; background: var(--dim); }
.hero-badge-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 9px; }
/* 主打款式：整块走红，是首屏唯一的高饱和信号 */
.hero-badges-hl {
  border-color: rgba(220, 38, 38, .32);
  background: rgba(220, 38, 38, .07);
  color: #b91c1c;
  font-weight: 650;
}
.hero-badges-hl b {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, .16);
  animation: rail-pulse-red 2.4s ease-in-out infinite;
}
@keyframes rail-pulse-red {
  0%, 100% { box-shadow: 0 0 0 3px rgba(220, 38, 38, .16); }
  50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, .05); }
}
html.dark .hero-badges-hl { border-color: rgba(248, 113, 113, .36); background: rgba(248, 113, 113, .12); color: #fca5a5; }
html.dark .hero-badges-hl b { background: #f87171; box-shadow: 0 0 0 3px rgba(248, 113, 113, .18); }
.hero-title { margin-top: 28px; font-size: clamp(40px, 6vw, 84px); font-weight: 800; letter-spacing: -.04em; line-height: 1.02; }
.hero-title span { display: block; }
.hero-lead { margin: 22px auto 0; max-width: 660px; color: var(--muted); font-size: 16.5px; line-height: 1.7; }
.hero-cta { display: flex; justify-content: center; gap: 12px; margin-top: 34px; }
.chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 34px; }
.chips li {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 7px 16px;
  background: var(--surface-2);
  font-size: 13px;
  color: var(--muted);
  transition: border-color .16s ease, color .16s ease;
}
.chips li:hover { border-color: var(--accent-line); color: var(--accent-text); }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 820px; margin: 44px auto 0; }
.stats dt { font-size: 38px; font-weight: 800; letter-spacing: -.03em; color: var(--accent); }
.stats dd { margin-top: 7px; font-size: 10.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); }

/* Popular paths */
.grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 32px; }
.card {
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 24px;
  background: var(--surface);
  transition: border-color .18s ease, transform .18s ease;
}
.card:hover { border-color: var(--border-2); transform: translateY(-2px); }
.card-ic {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
}
.card b { display: block; margin-top: 16px; font-size: 15.5px; font-weight: 650; }
.card p { margin-top: 9px; color: var(--muted); font-size: 13.5px; line-height: 1.7; }
.card-go {
  display: inline-block;
  margin-top: 16px;
  color: var(--accent-text);
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Developer first */
.dev { display: grid; grid-template-columns: 1fr 1.05fr; gap: 48px; align-items: center; }
.dev .big { margin-top: 12px; }
.dev .big span { display: block; color: var(--muted); }
.dev-list { display: grid; gap: 18px; margin-top: 30px; }
.dev-item { display: grid; grid-template-columns: 34px 1fr; gap: 14px; }
.dev-ic {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--accent-soft);
  color: var(--accent);
}
.dev-item b { display: block; font-size: 14.5px; font-weight: 650; }
.dev-item p { margin-top: 4px; color: var(--muted); font-size: 13px; line-height: 1.6; }
.code-card { min-width: 0; overflow: hidden; border: 1px solid var(--border); border-radius: var(--r); background: var(--surface); }
.code-top {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
  background: var(--surface-2);
}
.code-top .dots { display: flex; gap: 6px; }
.code-top .dots i { width: 9px; height: 9px; border-radius: 50%; background: var(--border-2); }
.code-label { color: var(--dim); font-size: 11.5px; }
.code-copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 3px 9px;
  color: var(--muted);
  background: var(--surface);
  cursor: pointer;
  font-size: 11.5px;
}
.code-copy:hover { color: var(--fg); border-color: var(--border-2); }
.code-body {
  overflow-x: auto;
  padding: 20px;
  color: var(--muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.9;
}

/* Architecture */
.arch { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 26px; }
.panel { border: 1px solid var(--border); border-radius: var(--r); background: var(--surface); overflow: hidden; }
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  padding: 14px 20px;
}
.panel-title { font-size: 13.5px; font-weight: 650; }
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 3px 10px;
  background: var(--surface-2);
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
}
.pill i { width: 6px; height: 6px; border-radius: 50%; background: var(--fg); }
.panel-body { padding: 22px 20px; }
.step { position: relative; display: grid; grid-template-columns: 30px 1fr; gap: 14px; padding-bottom: 20px; }
.step:last-of-type { padding-bottom: 0; }
.step::before { content: ""; position: absolute; left: 14px; top: 30px; bottom: 0; width: 1px; background: var(--border); }
.step:last-of-type::before { display: none; }
.step-n {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--surface-2);
  font-size: 12px;
  font-weight: 700;
  z-index: 1;
}
.step b { display: block; font-size: 14.5px; font-weight: 650; }
.step p { margin-top: 4px; color: var(--muted); font-size: 13px; line-height: 1.6; }
.bignum { display: flex; align-items: baseline; gap: 14px; margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--border); }
.bignum b { font-size: 38px; font-weight: 800; letter-spacing: -.03em; }
.bignum p:first-child { font-size: 14px; font-weight: 650; }
.bignum p:last-child { margin-top: 3px; color: var(--dim); font-size: 12.5px; }
.fmt-list { padding: 8px; }
.endpoint-row { display: flex; align-items: center; gap: 10px; border-radius: 10px; padding: 10px 12px; }
.endpoint-row:hover { background: var(--surface-2); }
.endpoint-method {
  flex: none;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 2px 6px;
  background: var(--surface-2);
  font-size: 10px;
  font-weight: 600;
  color: var(--muted);
}
.endpoint-row code {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  color: var(--fg);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.endpoint-row small { flex: none; color: var(--dim); font-size: 11.5px; }
.panel-note { padding: 4px 20px 18px; color: var(--muted); font-size: 12.5px; line-height: 1.7; }

/* Final CTA */
.final {
  border: 1px solid var(--accent-line);
  border-radius: 20px;
  padding: 48px 32px;
  text-align: center;
  background: var(--surface);
}
.final .big { margin-top: 14px; }
.final .lead { margin: 14px auto 0; }

/* Footer：信息不减，间距全部收一档；免责声明与版权同处一条水平带 */
.site-footer { border-top: 1px solid var(--border); padding: 40px 0 24px; margin-top: 48px; }
.footer-top { display: grid; grid-template-columns: 1.6fr repeat(3, 1fr); gap: 30px; align-items: start; }
.footer-brand > p { margin-top: 10px; color: var(--muted); font-size: 12.5px; line-height: 1.65; max-width: 320px; line-break: strict; }
.footer-mail {
  display: inline-block;
  margin-top: 10px;
  color: var(--fg);
  font-size: 12.5px;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.footer-col { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.footer-col > strong { font-size: 12px; font-weight: 650; margin-bottom: 2px; }
.footer-col a { color: var(--muted); font-size: 12.5px; line-height: 1.5; text-decoration: none; }
.footer-col a:hover { color: var(--fg); }
.footer-note { max-width: 260px; color: var(--muted); font-size: 12.5px; line-height: 1.6; }

.footer-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 14px 32px;
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1px solid var(--border);
}
.footer-legal { margin: 0; max-width: 620px; color: var(--dim); font-size: 11.5px; line-height: 1.65; }
.footer-meta { display: flex; align-items: center; gap: 12px; color: var(--dim); font-size: 12px; white-space: nowrap; }
.footer-tags { display: flex; gap: 6px; }
.footer-tags i { font-style: normal; border: 1px solid var(--border); border-radius: 5px; padding: 2px 7px; font-size: 10.5px; color: var(--muted); }

/* 悬浮客服：右侧居中，收起时只有一颗橙色按钮，点开展出服务时间与渠道 */
.support-dock {
  position: fixed;
  right: 20px;
  top: 50%;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  transform: translateY(-50%);
}
.support-fab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  color: #ffffff;
  background: var(--primary);
  font-size: 13.5px;
  font-weight: 650;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(217, 119, 87, .34);
  transition: background .16s ease, transform .16s ease, box-shadow .16s ease;
}
.support-fab:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 14px 30px rgba(217, 119, 87, .40); }
.support-fab:focus-visible { outline: 2px solid var(--fg); outline-offset: 3px; }
.support-fab.is-open { background: var(--fg); box-shadow: 0 10px 24px rgba(25, 24, 23, .26); }

.support-panel {
  width: 244px;
  border: 1px solid var(--border-2);
  border-radius: 16px;
  padding: 14px;
  background: var(--surface);
  box-shadow: 0 16px 38px rgba(25, 24, 23, .15), 0 2px 6px rgba(25, 24, 23, .06);
}
html.dark .support-panel { box-shadow: 0 16px 38px rgba(0, 0, 0, .55), 0 2px 6px rgba(0, 0, 0, .4); }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.panel-head strong { font-size: 13.5px; font-weight: 700; }
.panel-close {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: none;
  border-radius: 7px;
  color: var(--dim);
  background: transparent;
  cursor: pointer;
}
.panel-close:hover { color: var(--fg); background: var(--surface-2); }
/* 服务时间：面板里唯一的说明文字，单独一条带底色，避免被当成链接忽略 */
.panel-hours {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  border-radius: 9px;
  padding: 7px 9px;
  color: var(--accent-text);
  background: var(--accent-soft);
  font-size: 11.5px;
  font-weight: 600;
}
.support-rail { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
.rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid transparent;
  border-radius: 11px;
  padding: 7px 6px;
  text-decoration: none;
  transition: background .16s ease, border-color .16s ease;
}
.rail-item:hover { border-color: var(--border); background: var(--surface-2); }
.rail-item:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
/* 图标用渠道官方色：在奶油底上最跳，也最好认 */
.rail-icon { display: grid; width: 34px; height: 34px; flex: none; place-items: center; border-radius: 10px; color: #ffffff; }
.rail-telegram .rail-icon { background: #229ed9; }
.rail-discord .rail-icon { background: #5865f2; }
.rail-icon svg { width: 18px; height: 18px; }
.rail-label { display: grid; min-width: 0; gap: 1px; }
.rail-label strong { color: var(--fg); font-size: 12.5px; font-weight: 600; }
.rail-label small { color: var(--muted); font-size: 11px; line-height: 1.4; }

.home-shell :deep(.home-locale button) { color: var(--muted); }
.home-shell :deep(.home-locale > div) { border-color: var(--border); background: var(--surface); }

@media (max-width: 1080px) {
  .grid4 { grid-template-columns: repeat(2, 1fr); }
  .dev, .arch { grid-template-columns: 1fr; gap: 36px; }
  .footer-top { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
}
@media (max-width: 640px) {
  .section-inner { padding: 0 18px; }
  .grid4, .stats { grid-template-columns: 1fr; }
  .hero { padding: 56px 0 44px; }
  .hero-title { font-size: 40px; }
  .hero-cta { flex-direction: column; }
  .sec { padding: 40px 0; }
  .final { padding: 36px 20px; }
  .footer-top { grid-template-columns: 1fr; }
  .footer-bottom { grid-template-columns: 1fr; align-items: start; }
  .footer-meta { flex-wrap: wrap; white-space: normal; }
  .site-footer { margin-top: 40px; }
  .support-dock { right: 14px; top: auto; bottom: 14px; transform: none; }
  .support-panel { width: min(78vw, 244px); }
  .support-fab span { display: none; }
  .support-fab { padding: 14px; border-radius: 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .home-shell *, .home-shell *::before, .home-shell *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
</style>
