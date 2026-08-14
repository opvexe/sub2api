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
          <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">
            {{ t('home.landing.nav.docs') }}
          </a>
        </div>

        <div class="nav-actions">
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
            <router-link v-else :to="pricingEntry" class="secondary-action">
              <Icon name="book" size="sm" :stroke-width="2" aria-hidden="true" />
              {{ t('home.landing.hero.secondaryCta') }}
            </router-link>
          </div>

          <ul class="model-chip-row" :aria-label="t('home.landing.nav.models')">
            <li v-for="chip in modelChips" :key="chip.name">
              <i :style="{ background: chip.color }" aria-hidden="true"></i>
              {{ chip.name }}
            </li>
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
      <section id="guarantees" class="section capability-section" :aria-label="t('home.trustBar.title')">
        <div class="section-inner capability-grid">
          <article v-for="item in trustBarItems" :key="item.key" class="capability-card">
            <span class="capability-icon"><Icon :name="item.icon" size="md" :stroke-width="1.9" /></span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
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
            <router-link v-if="modelPlazaEnabled" to="/model-plaza" class="section-link">
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
              <a
                v-if="plan.anchor"
                :href="plan.to"
                target="_blank"
                rel="noopener noreferrer"
                class="pricing-action"
              >
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
        <div class="footer-top">
          <div class="footer-brand">
            <router-link to="/home" class="footer-brand-link" :aria-label="siteName">
              <span class="brand-mark"><img :src="brandLogo" :alt="siteName + ' logo'" /></span>
              <strong>OriginCoder</strong>
            </router-link>
            <p>{{ t('home.footer.description') }}</p>
            <div class="footer-channels">
              <a
                v-for="channel in supportLinks"
                :key="channel.key"
                :href="channel.href"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-channel"
                :class="'rail-' + channel.key"
                :aria-label="channel.label"
                :title="channel.label"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="channel.path" /></svg>
              </a>
            </div>
          </div>

          <div class="footer-cols">
            <nav class="footer-col" :aria-label="t('home.landing.footer.product')">
              <strong>{{ t('home.landing.footer.product') }}</strong>
              <router-link v-if="modelPlazaEnabled" to="/model-plaza">
                {{ t('modelPlaza.title') }}
              </router-link>
              <router-link to="/purchase">{{ t('home.landing.nav.pricing') }}</router-link>
              <a href="#developers">{{ t('home.landing.nav.developers') }}</a>
              <router-link :to="isAuthenticated ? dashboardPath : '/login'">
                {{ t('home.landing.footer.console') }}
              </router-link>
            </nav>

            <nav class="footer-col" :aria-label="t('home.landing.footer.resources')">
              <strong>{{ t('home.landing.footer.resources') }}</strong>
              <a v-if="docUrl" :href="docUrl" target="_blank" rel="noopener noreferrer">
                {{ t('home.landing.nav.docs') }}
              </a>
              <router-link to="/key-usage">{{ t('keyUsage.title') }}</router-link>
              <a :href="supportLinks[0]?.href" target="_blank" rel="noopener noreferrer">
                {{ t('home.community.support') }}
              </a>
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
        </div>

        <div class="footer-bottom">
          <span>&copy; {{ currentYear }} OriginCoder. {{ t('home.footer.allRightsReserved') }}</span>
          <span class="footer-slogan">{{ t('home.footer.slogan') }}</span>
        </div>
      </div>
    </footer>

    <!-- Floating support rail: channels are visible without a click -->
    <nav class="support-rail" :aria-label="t('home.community.title')">
      <span class="rail-caption" aria-hidden="true">
        <Icon name="chat" size="sm" :stroke-width="2" />
        {{ t('home.community.support') }}
      </span>
      <a
        v-for="channel in supportLinks"
        :key="channel.key"
        :href="channel.href"
        target="_blank"
        rel="noopener noreferrer"
        class="rail-item"
        :class="'rail-' + channel.key"
        :aria-label="channel.label"
      >
        <span class="rail-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path :d="channel.path" /></svg>
        </span>
        <span class="rail-label">
          <strong>{{ channel.label }}</strong>
          <small>{{ channel.handle }}</small>
        </span>
      </a>
      <span class="rail-status">
        <i></i>
        <span>{{ t('home.community.online') }}</span>
      </span>
    </nav>
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
const BRAND_LOGO_URL = '/logo-v2.png?v=origincoder-20260815'

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

// 模型广场可被管理员关闭；关闭时相关入口会被路由守卫打回首页，所以直接不展示。
const modelPlazaEnabled = computed(
  () => appStore.cachedPublicSettings?.model_plaza_enabled !== false
)
// 广场关闭时，"看价格"的落点退回注册/控制台。
const pricingEntry = computed(() =>
  modelPlazaEnabled.value ? '/model-plaza' : isAuthenticated.value ? dashboardPath.value : '/register'
)

const navLinks = computed(() =>
  modelPlazaEnabled.value ? [{ to: '/model-plaza', label: t('modelPlaza.title') }] : []
)

// 头像色块与下方模型标签共用同一份数据。
const modelChips = [
  { name: 'Claude', short: 'C', color: '#4964f4' },
  { name: 'Claude Code', short: 'CC', color: '#3f57dc' },
  { name: 'GPT', short: 'G', color: '#6366f1' },
  { name: 'Codex', short: 'CX', color: '#354bd2' },
  { name: 'CC-Switch', short: 'CCS', color: '#7b8ef8' },
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
    to: pricingEntry.value,
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
    to: CONTACT.telegram,
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
  t('home.landing.developer.points.ccswitch'),
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

const supportLinks = computed(() =>
  [
    {
      key: 'telegram',
      href: CONTACT.telegram,
      label: t('home.landing.contact.telegram.name'),
      handle: t('home.landing.contact.telegram.handle'),
      description: t('home.landing.contact.telegram.description'),
      path: TELEGRAM_PATH,
    },
    {
      key: 'discord',
      href: CONTACT.discord,
      label: t('home.landing.contact.discord.name'),
      handle: t('home.landing.contact.discord.handle'),
      description: t('home.landing.contact.discord.description'),
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
/*
 * 设计令牌：亮色为默认，深色在 html.dark 下整体换一套。
 * 圆角统一 12px（控件）/ 16px（卡片），描边统一 1px。
 */
.home-shell {
  --canvas: #ffffff;
  --canvas-alt: #f7f8fc;
  --surface: #ffffff;
  --border: #e5e7eb;
  --border-strong: #d8dbe3;
  --text: #111827;
  --text-muted: #6b7280;
  --text-dim: #9ca3af;
  --brand: #4964f4;
  --brand-strong: #3f57dc;
  --brand-ink: #354bd2;
  --brand-soft: #eef2ff;
  --brand-line: #e0e7ff;
  --code-bg: #ffffff;
  --shadow-sm: 0 6px 18px rgba(17, 24, 39, .04);
  --shadow-md: 0 14px 40px rgba(73, 100, 244, .1);
  --grid-line: rgba(73, 100, 244, .06);
  --radius: 12px;
  --radius-lg: 16px;

  min-height: 100vh;
  overflow-x: hidden;
  color: var(--text);
  background: var(--canvas);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "PingFang SC",
    "Hiragino Sans GB", system-ui, sans-serif;
}
html.dark .home-shell {
  --canvas: #0b1020;
  --canvas-alt: #0f1526;
  --surface: #131a2e;
  --border: rgba(255, 255, 255, .09);
  --border-strong: rgba(255, 255, 255, .16);
  --text: #f8fafc;
  --text-muted: #9aa6bd;
  --text-dim: #6b7794;
  --brand: #8b9cf9;
  --brand-strong: #7b8ef8;
  --brand-ink: #a5b4fc;
  --brand-soft: rgba(73, 100, 244, .16);
  --brand-line: rgba(123, 142, 248, .26);
  --code-bg: #0f1526;
  --shadow-sm: 0 6px 18px rgba(0, 0, 0, .3);
  --shadow-md: 0 14px 40px rgba(0, 0, 0, .42);
  --grid-line: rgba(139, 156, 249, .08);
}

.section-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}
.section { padding: 104px 0; scroll-margin-top: 68px; }

/* Header */
.home-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--canvas) 86%, transparent);
  backdrop-filter: blur(18px);
}
.home-nav {
  display: flex;
  height: 68px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand-link { display: flex; min-width: 0; align-items: center; gap: 11px; color: inherit; text-decoration: none; }
.brand-mark {
  display: flex;
  width: 38px;
  height: 38px;
  flex: none;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}
.brand-name { display: block; font-size: 15px; font-weight: 700; letter-spacing: -.02em; }
.brand-caption { display: block; margin-top: 1px; font-size: 10px; font-weight: 500; color: var(--text-muted); }
.nav-links { display: flex; align-items: center; gap: 2px; }
.nav-links a {
  border-radius: 10px;
  padding: 8px 12px;
  color: var(--text-muted);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: color .18s ease, background .18s ease;
}
.nav-links a:hover { color: var(--brand); background: var(--canvas-alt); }
.nav-actions { display: flex; flex: none; align-items: center; gap: 6px; }
.theme-toggle {
  display: flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-muted);
  background: transparent;
  cursor: pointer;
  transition: color .18s ease, background .18s ease;
}
.theme-toggle:hover { color: var(--brand); background: var(--canvas-alt); }
.header-ghost {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  border-radius: 10px;
  padding: 0 12px;
  color: var(--text);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: color .18s ease, background .18s ease;
}
.header-ghost:hover { color: var(--brand); background: var(--canvas-alt); }
.header-action {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0 16px;
  color: #fff;
  background: #4964f4;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: background .18s ease;
}
.header-action:hover { background: #3f57dc; }

/* Hero */
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 112px 0 56px;
  background: linear-gradient(180deg, var(--canvas-alt) 0%, var(--canvas) 76%);
}
.hero-glow {
  position: absolute;
  left: 50%;
  top: -240px;
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
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 22%, #000, transparent 78%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 22%, #000, transparent 78%);
}
.hero-inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--brand-line);
  border-radius: 999px;
  padding: 7px 14px;
  color: var(--brand-ink);
  background: var(--brand-soft);
  font-size: 12.5px;
  font-weight: 500;
}
.hero-badge-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--brand); }
.hero-title {
  max-width: 900px;
  margin-top: 26px;
  color: var(--text);
  font-size: clamp(40px, 5.2vw, 64px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -.04em;
}
.hero-lead {
  max-width: 640px;
  margin-top: 22px;
  color: var(--text-muted);
  font-size: 16.5px;
  line-height: 1.75;
}
.hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 34px; }
.primary-action, .secondary-action {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius);
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.primary-action { color: #fff; background: #4964f4; }
.primary-action:hover { background: #3f57dc; }
.secondary-action { border: 1px solid var(--border-strong); color: var(--text); background: var(--surface); }
.secondary-action:hover { border-color: var(--brand); color: var(--brand); }
.model-chip-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 40px; }
.model-chip-row li {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 14px 6px 11px;
  color: var(--text-muted);
  background: var(--surface);
  font-size: 12.5px;
  font-weight: 500;
}
.model-chip-row i { width: 7px; height: 7px; flex: none; border-radius: 50%; }
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  width: 100%;
  max-width: 620px;
  margin-top: 48px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  overflow: hidden;
}
.hero-stats > div { border-right: 1px solid var(--border); padding: 20px 12px; }
.hero-stats > div:last-child { border-right: 0; }
.hero-stats dt { color: var(--brand); font-size: 24px; font-weight: 700; letter-spacing: -.03em; }
.hero-stats dd { margin-top: 4px; color: var(--text-muted); font-size: 12.5px; }

/* Capability grid (2x2) */
.capability-section { background: var(--canvas); padding-top: 72px; padding-bottom: 0; }
.capability-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.capability-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  column-gap: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 22px 24px;
  background: var(--surface);
  transition: border-color .18s ease;
}
.capability-card:hover { border-color: var(--brand-line); }
.capability-icon {
  grid-row: span 2;
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  color: var(--brand);
  background: var(--brand-soft);
}
.capability-card strong { align-self: center; color: var(--text); font-size: 15px; font-weight: 600; }
.capability-card p { margin-top: 4px; color: var(--text-muted); font-size: 13.5px; line-height: 1.7; }

/* Shared section head */
.section-head { max-width: 660px; margin: 0 auto; text-align: center; }
.section-eyebrow { color: var(--brand); font-size: 13px; font-weight: 600; }
.section-head h2 { margin-top: 12px; color: var(--text); font-size: clamp(28px, 3.2vw, 38px); font-weight: 700; line-height: 1.2; letter-spacing: -.035em; }
.section-lead { margin-top: 14px; color: var(--text-muted); font-size: 15.5px; line-height: 1.75; }
.section-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; color: var(--brand); font-size: 13.5px; font-weight: 600; text-decoration: none; }
.section-link:hover { color: var(--brand-strong); }

/* Pricing */
.pricing-section { background: var(--canvas); }
.pricing-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 52px; }
.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 26px;
  background: var(--surface);
  transition: border-color .18s ease;
}
.pricing-card:hover { border-color: var(--border-strong); }
.pricing-card-featured { border-color: var(--brand); background: color-mix(in srgb, var(--brand-soft) 55%, var(--surface)); }
.pricing-ribbon {
  position: absolute;
  right: 22px;
  top: -11px;
  border-radius: 999px;
  padding: 4px 12px;
  color: #fff;
  background: #4964f4;
  font-size: 11px;
  font-weight: 600;
}
.pricing-eyebrow { color: var(--text-dim); font-size: 11px; font-weight: 600; letter-spacing: .12em; }
.pricing-card h3 { margin-top: 12px; color: var(--text); font-size: 21px; font-weight: 700; letter-spacing: -.03em; }
.pricing-description { margin-top: 10px; color: var(--text-muted); font-size: 14px; line-height: 1.7; }
.pricing-points { display: grid; gap: 10px; margin-top: 24px; padding-top: 22px; border-top: 1px solid var(--border); }
.pricing-points li { display: flex; align-items: flex-start; gap: 8px; color: var(--text); font-size: 13.5px; line-height: 1.55; }
.pricing-points svg { flex: none; margin-top: 2px; color: var(--brand); }
.pricing-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 26px;
  color: var(--brand);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
}
.pricing-action:hover { color: var(--brand-strong); }

/* Developer first */
.developer-section { background: var(--canvas-alt); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.developer-grid { display: grid; grid-template-columns: .95fr 1.05fr; align-items: center; gap: 56px; }
.developer-copy { min-width: 0; }
.developer-copy h2 { margin-top: 12px; color: var(--text); font-size: clamp(28px, 3.2vw, 38px); font-weight: 700; line-height: 1.2; letter-spacing: -.035em; }
.developer-copy h2 > span { display: block; }
.developer-title-accent { color: var(--brand); }
.developer-points { display: grid; gap: 11px; margin-top: 26px; }
.developer-points li { display: flex; align-items: center; gap: 8px; color: var(--text); font-size: 14px; }
.developer-points svg { flex: none; color: var(--brand); }
.developer-action { margin-top: 30px; }
.code-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--code-bg);
  box-shadow: var(--shadow-md);
}
.code-topbar {
  display: flex;
  height: 44px;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
  padding: 0 16px;
  background: var(--canvas-alt);
}
.code-dots { display: flex; gap: 6px; }
.code-dots span { width: 9px; height: 9px; border-radius: 50%; background: var(--border-strong); }
.code-label { color: var(--text-muted); font-size: 11px; font-weight: 600; letter-spacing: .08em; }
.code-body {
  overflow-x: auto;
  padding: 22px;
  color: var(--text);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.85;
}
.code-endpoints { border-top: 1px solid var(--border); padding: 8px; }
.code-endpoints > div { display: flex; align-items: center; gap: 10px; border-radius: 10px; padding: 9px 12px; }
.code-endpoints > div:hover { background: var(--canvas-alt); }
.code-method { flex: none; border-radius: 6px; padding: 3px 7px; color: var(--brand-ink); background: var(--brand-soft); font-size: 10px; font-weight: 700; }
.code-endpoints code { min-width: 0; flex: 1; overflow: hidden; color: var(--text-muted); font-size: 11.5px; text-overflow: ellipsis; white-space: nowrap; }
.code-endpoints small { flex: none; color: var(--text-dim); font-size: 10.5px; }

/* Final CTA */
.final-cta { padding: 104px 0; background: var(--canvas); }
.final-cta-inner { display: flex; flex-direction: column; align-items: center; text-align: center; }
.final-cta-eyebrow { color: var(--brand); font-size: 13px; font-weight: 600; }
.final-cta-inner h2 { margin-top: 12px; color: var(--text); font-size: clamp(28px, 3.4vw, 40px); font-weight: 700; letter-spacing: -.035em; }
.final-cta-inner > p { max-width: 560px; margin-top: 14px; color: var(--text-muted); font-size: 15.5px; line-height: 1.75; }
.final-cta-inner .primary-action { margin-top: 30px; }

/* Footer */
.site-footer { border-top: 1px solid var(--border); padding: 64px 0 28px; background: var(--canvas-alt); }
.footer-top { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 2fr); gap: 56px; }
.footer-brand-link { display: inline-flex; align-items: center; gap: 11px; color: var(--text); text-decoration: none; }
.footer-brand-link strong { font-size: 16px; font-weight: 700; letter-spacing: -.02em; }
.footer-brand img { width: 100%; height: 100%; object-fit: contain; }
.footer-brand > p { max-width: 300px; margin-top: 14px; color: var(--text-muted); font-size: 13px; line-height: 1.75; }
.footer-channels { display: flex; gap: 8px; margin-top: 20px; }
.footer-channel {
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-muted);
  background: var(--surface);
  transition: color .18s ease, border-color .18s ease, transform .18s ease;
}
.footer-channel svg { width: 17px; height: 17px; }
.footer-channel:hover { transform: translateY(-2px); }
.footer-channel.rail-telegram:hover { color: #229ed9; border-color: #229ed9; }
.footer-channel.rail-discord:hover { color: #5865f2; border-color: #5865f2; }
.footer-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; }
.footer-col { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.footer-col > strong { color: var(--text); font-size: 13px; font-weight: 600; }
.footer-col a { color: var(--text-muted); font-size: 13px; text-decoration: none; transition: color .18s ease; }
.footer-col a:hover { color: var(--brand); }
.footer-note { max-width: 260px; color: var(--text-muted); font-size: 12.5px; line-height: 1.75; }
.footer-bottom {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 52px;
  border-top: 1px solid var(--border);
  padding-top: 24px;
  color: var(--text-dim);
  font-size: 12px;
}

/* Floating support rail — 渠道常驻可见，hover 才展开名称 */
.support-rail {
  position: fixed;
  right: 18px;
  top: 50%;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  transform: translateY(-50%);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 10px;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
}
.rail-caption { display: flex; align-items: center; gap: 5px; align-self: center; color: var(--text-muted); font-size: 10.5px; font-weight: 600; }
.rail-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  border-radius: 13px;
  padding: 5px;
  text-decoration: none;
  transition: background .18s ease;
}
.rail-item:hover { background: var(--canvas-alt); }
.rail-item:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.rail-icon {
  display: flex;
  width: 42px;
  height: 42px;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  color: #fff;
  transition: transform .18s ease;
}
.rail-icon svg { width: 21px; height: 21px; }
.rail-item:hover .rail-icon { transform: translateY(-1px); }
.rail-telegram .rail-icon { background: #229ed9; }
.rail-discord .rail-icon { background: #5865f2; }
.rail-label {
  display: grid;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  text-align: right;
  white-space: nowrap;
  transition: max-width .22s ease, opacity .18s ease;
}
.rail-item:hover .rail-label,
.rail-item:focus-visible .rail-label { max-width: 150px; opacity: 1; }
.rail-label strong { color: var(--text); font-size: 12px; font-weight: 600; }
.rail-label small { margin-top: 1px; color: var(--text-dim); font-size: 10px; }
.rail-status {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 5px;
  align-self: center;
  border-top: 1px solid var(--border);
  padding-top: 8px;
  color: #10b981;
  font-size: 10px;
  font-weight: 600;
}
.rail-status i { width: 5px; height: 5px; border-radius: 50%; background: #10b981; }

.home-shell :deep(.home-locale button) { color: var(--text-muted); }
.home-shell :deep(.home-locale > div) { border-color: var(--border); background: var(--surface); }

@media (max-width: 1023px) {
  .nav-links { display: none; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 560px; margin-left: auto; margin-right: auto; }
  .developer-grid { grid-template-columns: 1fr; gap: 40px; }
  .footer-top { grid-template-columns: 1fr; gap: 40px; }
}
@media (max-width: 640px) {
  .section-inner { padding-left: 16px; padding-right: 16px; }
  .home-nav { height: 60px; gap: 8px; }
  .brand-caption { display: none; }
  .brand-name { font-size: 14px; }
  .nav-actions { gap: 2px; }
  .header-ghost { display: none; }
  .header-action { min-height: 36px; padding: 0 13px; }
  .hero-section { padding: 72px 0 48px; }
  .hero-title { font-size: 36px; }
  .hero-lead { font-size: 15px; }
  .hero-stats { grid-template-columns: 1fr; max-width: 340px; }
  .hero-stats > div { border-right: 0; border-bottom: 1px solid var(--border); }
  .hero-stats > div:last-child { border-bottom: 0; }
  .section { padding: 72px 0; }
  .capability-section { padding-top: 72px; }
  .capability-grid { grid-template-columns: 1fr; }
  .final-cta { padding: 72px 0; }
  .pricing-card { padding: 24px 20px; }
  .code-body { font-size: 11.5px; }
  .footer-cols { grid-template-columns: 1fr; gap: 26px; }
  .footer-bottom { flex-direction: column; gap: 8px; }
  .support-rail { right: 12px; top: auto; bottom: 12px; flex-direction: row; align-items: center; gap: 6px; padding: 7px; border-radius: 999px; transform: none; }
  .rail-caption, .rail-status span { display: none; }
  .rail-status { width: auto; border-top: 0; border-left: 1px solid var(--border); padding: 0 0 0 8px; margin-left: 2px; }
  .rail-icon { width: 38px; height: 38px; border-radius: 50%; }
  .rail-label { display: none; }
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
