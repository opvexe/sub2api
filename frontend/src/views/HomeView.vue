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
            <img :src="brandLogo" :alt="siteName + ' logo'" class="h-full w-full object-contain" />
          </span>
          <span class="min-w-0">
            <strong class="brand-name">OriginCoder</strong>
            <small class="brand-caption">{{ t('home.brandCaption') }}</small>
          </span>
        </router-link>

        <div class="nav-links">
          <router-link v-for="link in navLinks" :key="link.to" :to="link.to">{{ link.label }}</router-link>
          <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">{{ t('home.docs') }}</a>
        </div>

        <div class="nav-actions">
          <LocaleSwitcher class="home-locale" />
          <router-link :to="isAuthenticated ? dashboardPath : '/login'" class="header-ghost">
            {{ isAuthenticated ? t('home.dashboard') : t('home.login') }}
          </router-link>
          <router-link :to="isAuthenticated ? dashboardPath : '/register'" class="header-action">
            {{ isAuthenticated ? t('home.goToDashboard') : t('home.getStarted') }}
          </router-link>
        </div>
      </nav>
    </header>

    <main>
      <!-- Hero -->
      <section id="service" class="hero-section">
        <div class="hero-glow" aria-hidden="true"></div>
        <div class="hero-grid" aria-hidden="true"></div>

        <div class="section-inner hero-inner">
          <div class="model-orbit" aria-hidden="true">
            <span v-for="chip in modelChips" :key="chip.short" :style="{ background: chip.color }">
              {{ chip.short }}
            </span>
          </div>

          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            {{ t('home.landing.hero.badge') }}
          </div>

          <h1 class="hero-title">{{ t('home.landing.hero.headline') }}</h1>
          <p class="hero-lead">{{ t('home.landing.hero.lead') }}</p>

          <div class="hero-actions">
            <router-link :to="isAuthenticated ? dashboardPath : '/register'" class="primary-action">
              {{ isAuthenticated ? t('home.goToDashboard') : t('home.landing.hero.primaryCta') }}
              <Icon name="arrowRight" size="sm" :stroke-width="2.4" aria-hidden="true" />
            </router-link>
            <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer" class="secondary-action">
              <Icon name="book" size="sm" :stroke-width="2" aria-hidden="true" />
              {{ t('home.landing.hero.secondaryCta') }}
            </a>
            <router-link v-else to="/model-plaza" class="secondary-action">
              <Icon name="book" size="sm" :stroke-width="2" aria-hidden="true" />
              {{ t('home.landing.hero.secondaryCta') }}
            </router-link>
          </div>

          <ul class="model-chip-row" :aria-label="t('home.landing.nav.models')">
            <li v-for="chip in modelChips" :key="chip.name">{{ chip.name }}</li>
          </ul>

          <dl class="hero-stats">
            <div v-for="stat in heroStats" :key="stat.key">
              <dt>{{ stat.value }}</dt>
              <dd>{{ stat.label }}</dd>
            </div>
          </dl>
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

      <!-- Pricing -->
      <section id="pricing" class="section pricing-section">
        <div class="section-inner">
          <div class="section-head">
            <p class="section-eyebrow">{{ t('home.landing.pricing.eyebrow') }}</p>
            <h2>{{ t('home.landing.pricing.title') }}</h2>
            <p class="section-lead">{{ t('home.landing.pricing.description') }}</p>
            <router-link to="/model-plaza" class="section-link">
              {{ t('home.landing.pricing.link') }}
              <Icon name="arrowRight" size="xs" :stroke-width="2.4" aria-hidden="true" />
            </router-link>
          </div>

          <div class="pricing-grid">
            <article
              v-for="plan in pricingPlans"
              :key="plan.key"
              class="pricing-card"
              :class="{ 'pricing-card-featured': plan.featured }"
            >
              <span v-if="plan.featured" class="pricing-ribbon">
                {{ t('home.landing.pricing.recommended') }}
              </span>
              <p class="pricing-eyebrow">{{ plan.eyebrow }}</p>
              <h3>{{ plan.title }}</h3>
              <p class="pricing-description">{{ plan.description }}</p>
              <ul class="pricing-points">
                <li v-for="point in plan.points" :key="point">
                  <Icon name="checkCircle" size="sm" :stroke-width="2.2" aria-hidden="true" />
                  {{ point }}
                </li>
              </ul>
              <a v-if="plan.anchor" :href="plan.to" class="pricing-action">
                {{ plan.action }}
                <Icon name="arrowRight" size="xs" :stroke-width="2.4" aria-hidden="true" />
              </a>
              <router-link v-else :to="plan.to" class="pricing-action">
                {{ plan.action }}
                <Icon name="arrowRight" size="xs" :stroke-width="2.4" aria-hidden="true" />
              </router-link>
            </article>
          </div>
        </div>
      </section>

      <!-- Developer first -->
      <section id="developers" class="section developer-section">
        <div class="section-inner developer-grid">
          <div class="developer-copy">
            <p class="section-eyebrow">{{ t('home.landing.developer.eyebrow') }}</p>
            <h2>
              <span>{{ t('home.landing.developer.titleLead') }}</span>
              <span class="developer-title-accent">{{ t('home.landing.developer.titleAccent') }}</span>
            </h2>
            <p class="section-lead">{{ t('home.landing.developer.description') }}</p>
            <ul class="developer-points">
              <li v-for="point in developerPoints" :key="point">
                <Icon name="checkCircle" size="sm" :stroke-width="2.2" aria-hidden="true" />
                {{ point }}
              </li>
            </ul>
            <a
              v-if="docUrl"
              :href="docUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="secondary-action developer-action"
            >
              {{ t('home.landing.developer.action') }}
              <Icon name="arrowRight" size="sm" :stroke-width="2.4" aria-hidden="true" />
            </a>
          </div>

          <div class="code-card">
            <div class="code-topbar">
              <div class="code-dots" aria-hidden="true"><span></span><span></span><span></span></div>
              <span class="code-label">{{ t('home.landing.developer.codeLabel') }}</span>
            </div>
            <pre class="code-body"><code>{{ curlSnippet }}</code></pre>
            <div class="code-endpoints" :aria-label="t('home.servicePreview.formats.title')">
              <div v-for="format in requestFormats" :key="format.key">
                <span class="code-method">POST</span>
                <code>{{ format.endpoint }}</code>
                <small>{{ format.label }}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Compact promotion for one other product -->
      <section id="ecosystem" class="section ecosystem-section">
        <div class="section-inner">
          <a
            href="https://shop.origincoder.ai"
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

      <!-- Final CTA -->
      <section class="final-cta">
        <div class="section-inner final-cta-inner">
          <p class="final-cta-eyebrow">{{ t('home.landing.finalCta.eyebrow') }}</p>
          <h2>{{ t('home.landing.finalCta.title') }}</h2>
          <p>{{ t('home.landing.finalCta.description') }}</p>
          <router-link :to="isAuthenticated ? dashboardPath : '/register'" class="primary-action">
            {{ isAuthenticated ? t('home.goToDashboard') : t('home.landing.finalCta.action') }}
            <Icon name="arrowRight" size="sm" :stroke-width="2.4" aria-hidden="true" />
          </router-link>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="section-inner">
        <div class="footer-main">
          <div class="footer-brand">
            <span class="brand-mark"><img :src="brandLogo" :alt="siteName + ' logo'" /></span>
            <div><strong>OriginCoder</strong><p>{{ t('home.footer.description') }}</p></div>
          </div>

          <nav class="footer-col" :aria-label="t('home.landing.footer.product')">
            <strong>{{ t('home.landing.footer.product') }}</strong>
            <router-link to="/model-plaza">{{ t('home.landing.nav.models') }}</router-link>
            <router-link to="/purchase">{{ t('home.landing.nav.pricing') }}</router-link>
            <a href="#developers">{{ t('home.landing.nav.developers') }}</a>
            <router-link :to="isAuthenticated ? dashboardPath : '/login'">
              {{ t('home.landing.footer.console') }}
            </router-link>
          </nav>

          <nav class="footer-col" :aria-label="t('home.landing.footer.resources')">
            <strong>{{ t('home.landing.footer.resources') }}</strong>
            <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">
              {{ t('home.landing.footer.quickStart') }}
            </a>
            <router-link to="/key-usage">{{ t('keyUsage.title') }}</router-link>
            <a href="#ecosystem">{{ t('home.nav.ecosystem') }}</a>
            <a href="#support">{{ t('home.community.support') }}</a>
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
          <span>&copy; {{ currentYear }} OriginCoder. {{ t('home.footer.allRightsReserved') }}</span>
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
              <svg viewBox="0 0 24 24" fill="currentColor"><path :d="support.path" /></svg>
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
import { applyHomeSeo } from '@/utils/seo'
import { sanitizeUrl } from '@/utils/url'

const { t } = useI18n()
const authStore = useAuthStore()
const appStore = useAppStore()
const BRAND_LOGO_URL = '/logo-v2.png?v=origincoder-20260814'

// 留空的客服渠道不会展示。
const CONTACT = {
  telegram: 'https://t.me/origincoder998',
  discord: 'https://discord.gg/2C6Qvd36pq',
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

// 协议文档由管理员在后台配置；没有配置时footer改显示联系方式。
const legalDocuments = computed(() =>
  (appStore.cachedPublicSettings?.login_agreement_documents || []).filter(
    (doc) => doc?.id && doc?.title
  )
)

const navLinks = computed(() => [
  { to: '/model-plaza', label: t('home.landing.nav.models') },
  { to: '/purchase', label: t('home.landing.nav.pricing') },
  { to: '/key-usage', label: t('keyUsage.title') },
])

// 头像色块与下方模型标签共用同一份数据。
const modelChips = [
  { name: 'Claude', short: 'C', color: '#4964f4' },
  { name: 'GPT', short: 'G', color: '#3f57dc' },
  { name: 'Gemini', short: 'GM', color: '#6366f1' },
  { name: 'DeepSeek', short: 'DS', color: '#354bd2' },
  { name: 'Grok', short: 'GR', color: '#7b8ef8' },
  { name: 'Qwen', short: 'Q', color: '#2c3ea8' },
]

const heroStats = computed(() => [
  {
    key: 'models',
    value: t('home.landing.hero.stats.modelsValue'),
    label: t('home.landing.hero.stats.modelsLabel'),
  },
  {
    key: 'compatible',
    value: t('home.landing.hero.stats.compatibleValue'),
    label: t('home.landing.hero.stats.compatibleLabel'),
  },
  {
    key: 'stream',
    value: t('home.landing.hero.stats.streamValue'),
    label: t('home.landing.hero.stats.streamLabel'),
  },
])

const pricingPlans = computed(() => [
  {
    key: 'payg',
    featured: false,
    anchor: false,
    to: '/model-plaza',
    eyebrow: t('home.landing.pricing.payg.eyebrow'),
    title: t('home.landing.pricing.payg.title'),
    description: t('home.landing.pricing.payg.description'),
    action: t('home.landing.pricing.payg.action'),
    points: [
      t('home.landing.pricing.payg.points.price'),
      t('home.landing.pricing.payg.points.lockIn'),
      t('home.landing.pricing.payg.points.switch'),
    ],
  },
  {
    key: 'subscription',
    featured: true,
    anchor: false,
    to: '/purchase',
    eyebrow: t('home.landing.pricing.subscription.eyebrow'),
    title: t('home.landing.pricing.subscription.title'),
    description: t('home.landing.pricing.subscription.description'),
    action: t('home.landing.pricing.subscription.action'),
    points: [
      t('home.landing.pricing.subscription.points.tiers'),
      t('home.landing.pricing.subscription.points.steady'),
      t('home.landing.pricing.subscription.points.records'),
    ],
  },
  {
    key: 'support',
    featured: false,
    anchor: true,
    to: '#support',
    eyebrow: t('home.landing.pricing.support.eyebrow'),
    title: t('home.landing.pricing.support.title'),
    description: t('home.landing.pricing.support.description'),
    action: t('home.landing.pricing.support.action'),
    points: [
      t('home.landing.pricing.support.points.troubleshoot'),
      t('home.landing.pricing.support.points.guide'),
      t('home.landing.pricing.support.points.scope'),
    ],
  },
])

const developerPoints = computed(() => [
  t('home.landing.developer.points.endpoint'),
  t('home.landing.developer.points.routing'),
  t('home.landing.developer.points.streaming'),
])

const curlSnippet = `curl -X POST https://origincoder.com/v1/chat/completions \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "your-model",
    "messages": [
      { "role": "user", "content": "Hello!" }
    ],
    "stream": true
  }'`

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
  applyHomeSeo({
    siteName: siteName.value,
    description: t('home.landing.hero.lead'),
    logoUrl: siteLogo.value || BRAND_LOGO_URL,
  })
})
</script>

<style scoped>
/* Palette: brand indigo #4964f4 on a white / #f7f8fc canvas. */
.home-shell {
  min-height: 100vh;
  overflow-x: hidden;
  color: #111827;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC",
    "Hiragino Sans GB", system-ui, sans-serif;
}
.home-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, .86);
  backdrop-filter: blur(18px);
}
.section-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}
.home-nav {
  display: flex;
  height: 68px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand-link {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
  color: inherit;
  text-decoration: none;
}
.brand-mark {
  display: flex;
  width: 38px;
  height: 38px;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(73, 100, 244, .08);
}
.brand-name { display: block; font-size: 15px; font-weight: 700; letter-spacing: -.02em; }
.brand-caption { display: block; margin-top: 1px; font-size: 10px; font-weight: 500; color: #6b7280; }
.nav-links { display: flex; align-items: center; gap: 2px; }
.nav-links a {
  border-radius: 8px;
  padding: 8px 12px;
  color: #6b7280;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: .18s ease;
}
.nav-links a:hover { color: #4964f4; background: #f7f8fc; }
.nav-actions { display: flex; flex: none; align-items: center; gap: 8px; }
.header-ghost {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  border-radius: 10px;
  padding: 0 12px;
  color: #374151;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: .18s ease;
}
.header-ghost:hover { color: #4964f4; background: #f7f8fc; }
.header-action {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0 16px;
  color: #fff;
  background: #4964f4;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(73, 100, 244, .18);
  transition: .18s ease;
}
.header-action:hover { background: #3f57dc; }

/* Hero */
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 96px 0 88px;
  background: linear-gradient(180deg, #f7f8fc 0%, #fff 78%);
}
.hero-glow {
  position: absolute;
  left: 50%;
  top: -220px;
  width: 900px;
  height: 560px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(closest-side, rgba(73, 100, 244, .16), transparent 72%);
  pointer-events: none;
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(73, 100, 244, .06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(73, 100, 244, .06) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 25%, #000, transparent 78%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 25%, #000, transparent 78%);
}
.hero-inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
.model-orbit { display: flex; align-items: center; }
.model-orbit span {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -.02em;
  box-shadow: 0 8px 24px rgba(73, 100, 244, .16);
}
.model-orbit span:first-child { margin-left: 0; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 26px;
  border: 1px solid #e0e7ff;
  border-radius: 999px;
  padding: 7px 14px;
  color: #354bd2;
  background: #eef2ff;
  font-size: 12.5px;
  font-weight: 500;
}
.hero-badge-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: #4964f4; }
.hero-title {
  max-width: 900px;
  margin-top: 22px;
  color: #111827;
  font-size: clamp(40px, 5.2vw, 64px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -.04em;
}
.hero-lead {
  max-width: 660px;
  margin-top: 20px;
  color: #6b7280;
  font-size: 16.5px;
  line-height: 1.75;
}
.hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 30px; }
.primary-action, .secondary-action {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: .18s ease;
}
.primary-action { color: #fff; background: #4964f4; box-shadow: 0 16px 48px rgba(73, 100, 244, .22); }
.primary-action:hover { background: #3f57dc; transform: translateY(-1px); }
.secondary-action { border: 1px solid #e5e7eb; color: #374151; background: #fff; }
.secondary-action:hover { border-color: #c7d2fe; color: #354bd2; background: #f7f8fc; }
.model-chip-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 34px; }
.model-chip-row li {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 6px 14px;
  color: #6b7280;
  background: #fff;
  font-size: 12.5px;
  font-weight: 500;
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 620px;
  margin-top: 42px;
}
.hero-stats > div {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(73, 100, 244, .06);
}
.hero-stats dt { color: #4964f4; font-size: 24px; font-weight: 700; letter-spacing: -.03em; }
.hero-stats dd { margin-top: 4px; color: #6b7280; font-size: 12.5px; }

/* Trust bar */
.trust-bar { border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; background: #f7f8fc; }
.trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.trust-bar-item { display: flex; min-width: 0; align-items: center; gap: 12px; border-right: 1px solid #e5e7eb; padding: 24px 20px; }
.trust-bar-item:last-child { border-right: 0; }
.trust-bar-icon { display: flex; width: 38px; height: 38px; flex: none; align-items: center; justify-content: center; border-radius: 11px; color: #4964f4; background: #eef2ff; }
.trust-bar-item strong { display: block; color: #111827; font-size: 13px; font-weight: 600; }
.trust-bar-item p { margin-top: 3px; color: #6b7280; font-size: 11.5px; line-height: 1.5; }

/* Shared sections */
.section { padding: 88px 0; scroll-margin-top: 68px; }
.section-head { max-width: 660px; margin: 0 auto; text-align: center; }
.section-eyebrow { color: #4964f4; font-size: 13px; font-weight: 600; letter-spacing: -.01em; }
.section-head h2 { margin-top: 12px; color: #111827; font-size: clamp(28px, 3.2vw, 38px); font-weight: 700; line-height: 1.2; letter-spacing: -.035em; }
.section-lead { margin-top: 14px; color: #6b7280; font-size: 15.5px; line-height: 1.75; }
.section-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; color: #4964f4; font-size: 13.5px; font-weight: 600; text-decoration: none; }
.section-link:hover { color: #3f57dc; }

/* Pricing */
.pricing-section { background: #fff; }
.pricing-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 46px; }
.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 28px 26px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(73, 100, 244, .05);
  transition: .2s ease;
}
.pricing-card:hover { transform: translateY(-3px); border-color: #c7d2fe; box-shadow: 0 16px 48px rgba(73, 100, 244, .1); }
.pricing-card-featured { border-color: #4964f4; box-shadow: 0 16px 48px rgba(73, 100, 244, .14); }
.pricing-ribbon {
  position: absolute;
  right: 20px;
  top: -11px;
  border-radius: 999px;
  padding: 4px 12px;
  color: #fff;
  background: #4964f4;
  font-size: 11px;
  font-weight: 600;
}
.pricing-eyebrow { color: #6b7280; font-size: 11px; font-weight: 600; letter-spacing: .12em; }
.pricing-card h3 { margin-top: 12px; color: #111827; font-size: 21px; font-weight: 700; letter-spacing: -.03em; }
.pricing-description { margin-top: 10px; color: #6b7280; font-size: 14px; line-height: 1.7; }
.pricing-points { display: grid; gap: 10px; margin-top: 22px; }
.pricing-points li { display: flex; align-items: flex-start; gap: 8px; color: #374151; font-size: 13.5px; line-height: 1.55; }
.pricing-points svg { flex: none; margin-top: 2px; color: #4964f4; }
.pricing-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 26px;
  color: #4964f4;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
}
.pricing-action:hover { color: #3f57dc; }

/* Developer first */
.developer-section { background: #f7f8fc; }
.developer-grid { display: grid; grid-template-columns: .95fr 1.05fr; align-items: center; gap: 56px; }
.developer-copy { min-width: 0; }
.developer-copy h2 { margin-top: 12px; color: #111827; font-size: clamp(28px, 3.2vw, 38px); font-weight: 700; line-height: 1.2; letter-spacing: -.035em; }
.developer-copy h2 > span { display: block; }
.developer-title-accent { color: #4964f4; }
.developer-points { display: grid; gap: 11px; margin-top: 24px; }
.developer-points li { display: flex; align-items: center; gap: 8px; color: #374151; font-size: 14px; }
.developer-points svg { flex: none; color: #4964f4; }
.developer-action { margin-top: 28px; }
.code-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 16px 48px rgba(73, 100, 244, .1);
}
.code-topbar {
  display: flex;
  height: 44px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 16px;
  background: #f7f8fc;
}
.code-dots { display: flex; gap: 6px; }
.code-dots span { width: 9px; height: 9px; border-radius: 50%; background: #d1d5db; }
.code-label { color: #6b7280; font-size: 11px; font-weight: 600; letter-spacing: .08em; }
.code-body {
  overflow-x: auto;
  padding: 20px;
  color: #1f2937;
  background: #fff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.85;
}
.code-endpoints { border-top: 1px solid #e5e7eb; padding: 8px; }
.code-endpoints > div { display: flex; align-items: center; gap: 10px; border-radius: 10px; padding: 9px 12px; }
.code-endpoints > div:hover { background: #f7f8fc; }
.code-method { flex: none; border-radius: 6px; padding: 3px 7px; color: #354bd2; background: #eef2ff; font-size: 10px; font-weight: 700; }
.code-endpoints code { min-width: 0; flex: 1; overflow: hidden; color: #374151; font-size: 11.5px; text-overflow: ellipsis; white-space: nowrap; }
.code-endpoints small { flex: none; color: #9ca3af; font-size: 10.5px; }

/* Ecosystem promo */
.ecosystem-section { background: #fff; }
.ecosystem-card {
  position: relative;
  display: grid;
  min-height: 268px;
  grid-template-columns: 240px 1fr auto;
  align-items: center;
  gap: 36px;
  overflow: hidden;
  border-radius: 20px;
  padding: 38px 42px 38px 28px;
  border: 1px solid #e0e7ff;
  color: #111827;
  background: linear-gradient(120deg, #f7f8fc 0%, #eef2ff 70%, #e0e7ff 130%);
  box-shadow: 0 16px 48px rgba(73, 100, 244, .1);
  text-decoration: none;
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.ecosystem-card:hover { transform: translateY(-3px); border-color: #a5b4fc; box-shadow: 0 20px 56px rgba(73, 100, 244, .14); }
.ecosystem-card:focus-visible { outline: 3px solid rgba(73, 100, 244, .3); outline-offset: 4px; }
.ecosystem-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(73,100,244,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(73,100,244,.07) 1px, transparent 1px); background-size: 32px 32px; mask-image: linear-gradient(to right, #000, transparent 80%); -webkit-mask-image: linear-gradient(to right, #000, transparent 80%); }
.ecosystem-art { position: relative; height: 168px; }
.ecosystem-orbit { position: absolute; border: 1px solid rgba(73,100,244,.24); border-radius: 50%; }
.orbit-one { width: 144px; height: 144px; left: 34px; top: 12px; }
.orbit-two { width: 96px; height: 96px; left: 58px; top: 36px; }
.ecosystem-cube { position: absolute; display: flex; width: 64px; height: 64px; left: 74px; top: 52px; align-items: center; justify-content: center; border: 1px solid #c7d2fe; border-radius: 18px; color: #4964f4; background: rgba(255,255,255,.8); box-shadow: 0 16px 48px rgba(73,100,244,.14); backdrop-filter: blur(10px); }
.ecosystem-copy { position: relative; z-index: 1; }
.ecosystem-eyebrow { color: #4964f4 !important; font-size: 12px !important; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
.ecosystem-copy h2 { max-width: 700px; margin-top: 10px; color: #111827; font-size: 32px; font-weight: 700; line-height: 1.22; letter-spacing: -.035em; }
.ecosystem-copy > p { max-width: 660px; margin-top: 13px; color: #6b7280; font-size: 14px; line-height: 1.75; }
.ecosystem-copy ul { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.ecosystem-copy li { border: 1px solid #c7d2fe; border-radius: 999px; padding: 6px 12px; color: #354bd2; background: rgba(255,255,255,.82); font-size: 11.5px; font-weight: 500; }
.ecosystem-action { position: relative; z-index: 1; display: inline-flex; min-height: 46px; align-items: center; gap: 8px; border-radius: 12px; padding: 0 20px; color: #fff; background: #4964f4; font-size: 13.5px; font-weight: 600; text-decoration: none; white-space: nowrap; box-shadow: 0 16px 48px rgba(73,100,244,.2); transition: .18s ease; }
.ecosystem-card:hover .ecosystem-action { background: #3f57dc; }

/* Final CTA */
.final-cta { border-top: 1px solid #e5e7eb; padding: 88px 0; background: #f7f8fc; }
.final-cta-inner { display: flex; flex-direction: column; align-items: center; text-align: center; }
.final-cta-eyebrow { color: #4964f4; font-size: 13px; font-weight: 600; }
.final-cta-inner h2 { margin-top: 12px; color: #111827; font-size: clamp(28px, 3.4vw, 40px); font-weight: 700; letter-spacing: -.035em; }
.final-cta-inner > p { max-width: 560px; margin-top: 14px; color: #6b7280; font-size: 15.5px; line-height: 1.75; }
.final-cta-inner .primary-action { margin-top: 28px; }

/* Footer */
.site-footer { border-top: 1px solid #e5e7eb; padding: 56px 0 28px; background: #fff; }
.footer-main { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; align-items: start; gap: 40px; }
.footer-brand { display: flex; gap: 12px; }
.footer-brand img { width: 100%; height: 100%; object-fit: contain; }
.footer-brand strong { font-size: 14px; font-weight: 700; }
.footer-brand p { max-width: 300px; margin-top: 8px; color: #6b7280; font-size: 12px; line-height: 1.7; }
.footer-col { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.footer-col > strong { color: #111827; font-size: 12.5px; font-weight: 600; }
.footer-col a { color: #6b7280; font-size: 12.5px; text-decoration: none; }
.footer-col a:hover { color: #4964f4; }
.footer-note { max-width: 260px; color: #6b7280; font-size: 12px; line-height: 1.7; }
.footer-bottom { display: flex; justify-content: space-between; gap: 20px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 22px; color: #9ca3af; font-size: 11.5px; }

/* Floating support */
.support-dock { position: fixed; right: 18px; top: 50%; z-index: 50; transform: translateY(-50%); }
.support-dock summary { position: relative; display: flex; width: 56px; min-height: 66px; cursor: pointer; list-style: none; flex-direction: column; align-items: center; justify-content: center; gap: 5px; border: 1px solid rgba(255,255,255,.35); border-radius: 16px; padding: 8px 5px; color: #fff; background: #4964f4; font-size: 10.5px; font-weight: 600; box-shadow: 0 16px 48px rgba(73,100,244,.28); transition: .18s ease; }
.support-dock summary::-webkit-details-marker { display: none; }
.support-dock summary:hover { transform: translateY(-2px); background: #3f57dc; }
.support-online { position: absolute; right: -2px; top: -2px; width: 11px; height: 11px; border: 2px solid #fff; border-radius: 50%; background: #34d399; }
.support-panel { position: absolute; right: calc(100% + 12px); top: 50%; width: 330px; overflow: hidden; border: 1px solid #e5e7eb; border-radius: 18px; background: #fff; box-shadow: 0 16px 48px rgba(73,100,244,.18); transform: translateY(-50%); }
.support-head { display: flex; align-items: start; justify-content: space-between; gap: 14px; padding: 18px; color: #fff; background: #4964f4; }
.support-head strong { font-size: 13px; font-weight: 700; }
.support-head p { margin-top: 4px; color: rgba(255,255,255,.78); font-size: 11px; }
.support-head > span { display: flex; flex: none; align-items: center; gap: 5px; border-radius: 999px; padding: 4px 8px; color: #fff; background: rgba(255,255,255,.16); font-size: 10px; font-weight: 600; }
.support-head i { width: 5px; height: 5px; border-radius: 50%; background: #34d399; }
.support-list { padding: 7px; }
.support-list a { display: flex; align-items: center; gap: 11px; border-radius: 12px; padding: 10px; color: #9ca3af; text-decoration: none; transition: .18s ease; }
.support-list a:hover { color: #4964f4; background: #f7f8fc; }
.support-logo { display: flex; width: 38px; height: 38px; flex: none; align-items: center; justify-content: center; border-radius: 11px; color: #fff; }
.support-logo svg { width: 18px; height: 18px; }
.support-telegram { background: #229ed9; }
.support-discord { background: #5865f2; }
.support-list a > span:nth-child(2) { min-width: 0; flex: 1; }
.support-list strong { display: block; color: #111827; font-size: 12px; font-weight: 600; }
.support-list small { display: block; margin-top: 2px; overflow: hidden; color: #9ca3af; font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }

.home-shell :deep(.home-locale button) { color: #6b7280; }
.home-shell :deep(.home-locale > div) { border-color: #e5e7eb; background: #fff; }

@media (max-width: 1023px) {
  .nav-links { display: none; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 560px; margin-left: auto; margin-right: auto; }
  .developer-grid { grid-template-columns: 1fr; gap: 40px; }
  .trust-grid { grid-template-columns: repeat(2, 1fr); }
  .trust-bar-item:nth-child(2) { border-right: 0; }
  .trust-bar-item:nth-child(-n+2) { border-bottom: 1px solid #e5e7eb; }
  .ecosystem-card { grid-template-columns: 190px 1fr; }
  .ecosystem-action { grid-column: 2; justify-self: start; }
  .footer-main { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .section-inner { padding-left: 16px; padding-right: 16px; }
  .home-nav { height: 60px; gap: 8px; }
  .brand-caption { display: none; }
  .brand-name { font-size: 14px; }
  .nav-actions { gap: 4px; }
  .header-ghost { display: none; }
  .header-action { min-height: 36px; padding: 0 13px; }
  .hero-section { padding: 64px 0 70px; }
  .model-orbit span { width: 36px; height: 36px; font-size: 10.5px; }
  .hero-title { font-size: 36px; }
  .hero-lead { font-size: 15px; }
  .hero-stats { grid-template-columns: 1fr; gap: 10px; }
  .trust-bar-item { padding: 18px 12px; }
  .section { padding: 64px 0; }
  .final-cta { padding: 64px 0; }
  .pricing-card { padding: 24px 20px; }
  .code-body { font-size: 11.5px; }
  .ecosystem-card { min-height: auto; grid-template-columns: 1fr; gap: 16px; padding: 26px 22px; }
  .ecosystem-art { display: none; }
  .ecosystem-action { grid-column: 1; }
  .ecosystem-copy h2 { font-size: 26px; }
  .footer-main { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; }
  .support-dock { right: 14px; top: auto; bottom: 14px; transform: none; }
  .support-dock summary { width: 50px; height: 50px; min-height: 50px; justify-content: center; padding: 0; border-radius: 50%; }
  .support-dock summary > span:last-child { display: none; }
  .support-panel { right: 0; top: auto; bottom: calc(100% + 12px); width: min(320px, calc(100vw - 28px)); transform: none; }
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
