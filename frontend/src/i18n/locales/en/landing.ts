export default {
  batchImageGuide: {
    title: 'Batch Image Generation',
    description: 'Submit multiple prompts in one job and download the generated images when complete'
  },
  // Home Page
  home: {
    nav: {
      primary: 'Primary navigation',
      features: 'Features',
      comparison: 'Compare',
      models: 'Models',
      reputation: 'Reputation',
      service: 'API Service',
      guarantees: 'Service Assurance'
    },
    highlights: 'Platform highlights',
    brandCaption: 'Claude · OpenAI gateway',
    productTagline: 'A unified API gateway for Claude and OpenAI models',
    viewOnGithub: 'View on GitHub',
    viewDocs: 'View Documentation',
    docs: 'Docs',
    switchToLight: 'Switch to Light Mode',
    switchToDark: 'Switch to Dark Mode',
    dashboard: 'Dashboard',
    login: 'Login',
    getStarted: 'Get Started',
    goToDashboard: 'Go to Dashboard',
    // User-focused value proposition
    heroSubtitle: 'One Key, All AI Models',
    heroEyebrow: 'OriginCoder · A reliable AI API service',
    heroTitleLead: 'A dependable AI API',
    heroTitleAccent: 'Built for long-term trust',
    heroDescription: 'OriginCoder brings Claude, GPT, Gemini, and other leading models behind one API—with transparent status, clear billing, and support you can actually reach.',
    heroTrust: {
      status: 'Transparent service status',
      billing: 'Every charge is traceable',
      support: 'Real people respond'
    },
    // Landing page (OriginCoder marketing layout)
    landing: {
      nav: {
        models: 'AI Models',
        pricing: 'Pricing',
        docs: 'API Documentation',
        architecture: 'Architecture',
        contact: 'Contact'
      },
      hero: {
        badgeCompatible: 'OpenAI-compatible',
        badgeUsd: 'Pay in USD',
        badgeCancel: 'Cancel any time',
        headline: 'One API.',
        headlineAccent: 'Every AI Model.',
        lead: 'The unified gateway to Claude, GPT, Gemini, DeepSeek and dozens more. Switch providers with one line of code — and settle it all on one invoice.',
        ctaPrimary: 'See pricing',
        ctaSecondary: 'Read the quickstart',
        stats: {
          modelsValue: '60+',
          modelsLabel: 'AI models',
          uptimeValue: '99.9%',
          uptimeLabel: 'Uptime target',
          oneValue: '1',
          oneLabel: 'Key, endpoint & invoice'
        }
      },
      paths: {
        eyebrow: 'Popular paths',
        title: 'Pick the client you actually use.',
        lead: 'OriginCoder works as a custom OpenAI-compatible API for coding agents, chat clients, CLI tools and your own applications.',
        action: 'View guide',
        agents: {
          title: 'Coding Agents',
          desc: 'Cursor, Cline, Roo Code, Kilo Code, Continue, Zed and any editor that accepts a custom OpenAI-compatible base URL.'
        },
        chat: {
          title: 'Chat Clients',
          desc: 'LibreChat, LobeChat, Open WebUI, Chatbox and other generic OpenAI-compatible front ends — no adapter needed.'
        },
        cli: {
          title: 'CLI Tools',
          desc: 'Claude Code, Codex CLI, Gemini CLI, Aider and terminal agents read the same key straight from your environment.'
        },
        apps: {
          title: 'Your Own Apps',
          desc: 'Keep your existing OpenAI SDK calls in Python, Node or Go. Swap the base URL and the model string, ship the rest unchanged.'
        }
      },
      developer: {
        eyebrow: 'Developer first',
        title: 'Integrate in Seconds.',
        titleAccent: 'Scale to Infinity.',
        lead: 'Fully OpenAI-compatible endpoints. Switch providers without changing your code. One API key, every model.',
        codeLabel: 'Bash · curl',
        copy: 'Copy',
        copied: 'Copied',
        endpoints: {
          title: 'OpenAI-compatible endpoints',
          desc: 'Works with the official OpenAI SDKs in Python, Node, Go and more.'
        },
        failover: {
          title: 'Automatic provider failover',
          desc: 'A degraded upstream is routed around instead of returning an error.'
        },
        protocol: {
          title: 'Multi-protocol support',
          desc: 'Streaming, function calling and embeddings supported end to end.'
        },
        records: {
          title: 'Per-request usage records',
          desc: 'Token counts and cost for every call, exportable for reconciliation.'
        }
      },
      architecture: {
        eyebrow: 'Architecture',
        lifecycle: 'Request lifecycle',
        active: 'Active',
        step1: { title: 'Unified endpoint', desc: 'One API surface for OpenAI, Anthropic and Gemini request formats.' },
        step2: { title: 'Smart routing', desc: 'Picks the fastest healthy provider by live latency and availability.' },
        step3: { title: 'Automatic failover', desc: 'Failed requests are instantly rerouted to an alternative channel.' },
        delivered: { value: '99.9%', title: 'Always delivered.', desc: 'Uptime target across every model.' },
        formats: 'Supported formats',
        autoDetected: 'Auto-detected',
        formatsNote: 'All three request formats are auto-detected and routed to the correct provider, so you can keep the SDK your project already uses instead of rewriting the client layer.',
        formatsCount: { value: '3', title: 'Request formats accepted.', desc: 'Detected automatically on every call.' }
      },
      finalCta: {
        eyebrow: 'Ready to build?',
        title: 'Ready to build the future?',
        lead: 'One key, one endpoint, one invoice. Pick a plan and make your first call in under five minutes.',
        primary: 'Choose a plan',
        secondary: 'Contact us'
      },
      footer: {
        brandDesc: 'One endpoint, one key and one invoice for every major AI model. Operated by Fvawi Drein INC, a company registered in the United States.',
        product: 'Product',
        support: 'Support',
        legal: 'Legal',
        models: 'AI models',
        pricing: 'Pricing',
        console: 'Console',
        docs: 'Documentation',
        status: 'Status',
        contact: 'Contact us',
        faq: 'FAQ',
        payments: 'Payments',
        paymentsLead: 'All prices are published and charged in { currency }, exclusive of taxes.',
        currency: 'US dollars (USD)',
        stripeTitle: 'Cards — Visa, Mastercard, American Express',
        stripeDesc: 'Processed securely by Stripe, Inc. We never receive or store your full card number. Subscriptions renew monthly and can be cancelled at any time from the dashboard.',
        usdtTitle: 'USDT — TRC20 & ERC20',
        usdtDesc: 'Manual prepaid top-up credited after on-chain confirmation. One-time, non-recurring, and non-refundable once confirmed. Send only USDT on a listed network.',
        disclaimer: 'OriginCoder is an independent platform. It is not affiliated with, endorsed by or sponsored by Anthropic, OpenAI, Google, Meta or any other model provider; all trademarks are the property of their respective owners. Model outputs are generated by third-party providers and may be inaccurate — review them before relying on them.'
      }
    },
    tags: {
      subscriptionToApi: 'Subscription to API',
      stickySession: 'Session Persistence',
      realtimeBilling: 'Pay As You Go'
    },
    // Pain points section
    painPoints: {
      title: 'Sound Familiar?',
      items: {
        expensive: {
          title: 'High Subscription Costs',
          desc: 'Paying for multiple AI subscriptions that add up every month'
        },
        complex: {
          title: 'Account Chaos',
          desc: 'Managing scattered accounts and API keys across different platforms'
        },
        unstable: {
          title: 'Service Interruptions',
          desc: 'Single accounts hitting rate limits and disrupting your workflow'
        },
        noControl: {
          title: 'No Usage Control',
          desc: "Can't track where your money goes or limit team member usage"
        }
      }
    },
    // Solutions section
    solutions: {
      title: 'One Platform from Access to Billing',
      subtitle: 'Core Product Capabilities'
    },
    features: {
      unifiedGateway: 'Unified API Gateway',
      unifiedGatewayDesc: 'Use one endpoint and one key for every connected model without repeatedly changing your application.',
      multiAccount: 'Smart Routing and Failover',
      multiAccountDesc: 'Select upstreams by health and load, then fail over automatically when a provider is unavailable.',
      balanceQuota: 'Real-Time Billing and Control',
      balanceQuotaDesc: 'Pay for actual usage, set quotas, and keep team spending visible with detailed records.',
      endpoint: 'Unified endpoint',
      openaiCompatible: 'OpenAI-compatible API',
      poolHealthy: 'Upstream account pool is healthy'
    },
    // Comparison section
    comparison: {
      eyebrow: 'A simpler way to access AI',
      title: 'Why Choose Us?',
      description: 'Bring scattered subscriptions, keys, and billing into one gateway so your team can focus on building products.',
      headers: {
        feature: 'Comparison',
        official: 'Official Subscriptions',
        us: 'Our Platform'
      },
      items: {
        pricing: {
          feature: 'Pricing',
          official: 'Fixed monthly fee, pay even if unused',
          us: 'Pay only for what you use'
        },
        models: {
          feature: 'Model Selection',
          official: 'Single provider only',
          us: 'Switch between models freely'
        },
        management: {
          feature: 'Account Management',
          official: 'Manage each service separately',
          us: 'Unified key, one dashboard'
        },
        stability: {
          feature: 'Stability',
          official: 'Single account rate limits',
          us: 'Multi-account pool, auto-failover'
        },
        control: {
          feature: 'Usage Control',
          official: 'Not available',
          us: 'Quotas & detailed analytics'
        }
      }
    },
    providers: {
      title: 'Supported AI Models',
      description: 'One API, Multiple Choices',
      supported: 'Supported',
      soon: 'Soon',
      claude: 'Claude',
      gemini: 'Gemini',
      antigravity: 'Antigravity',
      more: 'More'
    },
    preview: {
      console: 'Live request',
      status: 'Status',
      route: 'Route',
      latency: 'Latency',
      smartRouting: 'Smart routing enabled',
      smartRoutingDesc: 'Automatically selects the best upstream by health and load',
      healthy: 'Healthy',
      gatewayTitle: 'Unified AI Gateway',
      gatewaySubtitle: 'Access, routing, and billing',
      clientRequest: 'Request from your application',
      upstreamPool: 'Available model pool',
      available: 'available',
      auto: 'Automatic',
      oneKey: 'One key',
      failover: 'Failover',
      billing: 'Live billing'
    },
    liveMetrics: {
      title: 'Model Calls Today',
      live: 'Live',
      unit: 'model calls and still growing',
      updated: "Today's call trend"
    },
    modelStatus: {
      title: 'Model Status',
      description: 'See every leading model connection at a glance',
      allOperational: 'All operational',
      operational: 'Operational'
    },
    servicePreview: {
      console: 'Service operations',
      live: 'Monitoring',
      title: 'Reliability safeguards',
      allHealthy: 'Stable routes, continuously protected',
      formats: {
        title: 'Supported API formats',
        openai: 'OpenAI format',
        claude: 'Claude format',
        gemini: 'Gemini format'
      },
      route: 'Request route',
      yourApp: 'Your app',
      bestRoute: 'Smart upstream',
      normal: 'Enabled',
      events: {
        health: {
          title: 'Continuous upstream health checks',
          description: 'Routes are evaluated against live availability'
        },
        routing: {
          title: 'Smart routing and automatic failover',
          description: 'Traffic moves when a route becomes unavailable'
        },
        billing: {
          title: 'Request-level usage records',
          description: 'Model, token, and cost details stay queryable'
        }
      }
    },
    trustBar: {
      title: 'The foundation of a trustworthy service',
      items: {
        monitoring: {
          title: 'Health checks',
          description: 'Unhealthy upstreams drop out before your next call'
        },
        records: {
          title: 'Per-request accounting',
          description: 'Every call\'s tokens and cost stay traceable'
        },
        failover: {
          title: 'Automatic failover',
          description: 'When one upstream is down, requests move to the next'
        },
        support: {
          title: 'Real people',
          description: 'Telegram and Discord are staffed'
        }
      }
    },
    reputation: {
      eyebrow: 'How trust is earned',
      title: 'Reputation is built one dependable request at a time',
      description: 'A service worth keeping needs more than a long model list. Status should be visible, billing clear, and help within reach.',
      items: {
        transparent: {
          title: 'Service status stays visible',
          description: 'Health, incidents, and routing outcomes are clear, so you know where every request stands.',
          proof: 'Operational status remains queryable'
        },
        billing: {
          title: 'Every charge makes sense',
          description: 'Model, token, and cost details are recorded per request, keeping team spend accountable.',
          proof: 'Usage details available anytime'
        },
        support: {
          title: 'Help is genuinely reachable',
          description: 'Multiple support channels cover pre-sale questions and issues after you start building.',
          proof: 'Support through Telegram and Discord'
        }
      },
      promiseEyebrow: 'Our principles',
      promiseTitle: 'The OriginCoder service promise',
      promiseDescription: 'Trust does not come from inflated numbers. It comes from a consistently dependable experience.',
      commitments: {
        status: 'Never hide service status',
        billing: 'Never obscure how you are billed',
        support: 'Never leave a real issue unanswered',
        choice: 'Never lock choice behind needless rules'
      },
      promiseFooter: 'Built for the long term, one request at a time'
    },
    // CTA section
    cta: {
      title: 'Put your API reliability in OriginCoder’s hands',
      description: 'Start with one key and experience an AI API service that is transparent, stable, and accountable.',
      button: 'Create a free account'
    },
    footer: {
      allRightsReserved: 'All rights reserved.',
      description: 'A unified gateway for Claude and OpenAI models, speaking both the OpenAI and Anthropic protocols.',
      contact: 'Contact us',
      contactDescription: 'Support is available through Telegram and Discord',
      slogan: 'origincoder.com/v1',
      navigation: 'Quick links'
    },
    community: {
      openSupport: 'Open support channels',
      support: 'Support',
      title: 'Contact OriginCoder',
      description: 'Support through Telegram and Discord',
      online: 'Online',
      telegram: 'Telegram support',
      telegramDescription: 'Fast questions and integration help',
      discord: 'Discord community',
      discordDescription: 'Discussion, updates, and issue reports'
    }
  },

  // Key Usage Query Page
  keyUsage: {
    title: 'API Key Usage',
    subtitle: 'Enter your API Key to view real-time spending and usage status',
    placeholder: 'sk-ant-mirror-xxxxxxxxxxxx',
    query: 'Query',
    querying: 'Querying...',
    privacyNote: 'Your Key is processed locally in the browser and will not be stored',
    dateRange: 'Date Range:',
    dateRangeToday: 'Today',
    dateRange7d: '7 Days',
    dateRange30d: '30 Days',
    dateRange90d: '90 Days',
    dateRangeCustom: 'Custom',
    apply: 'Apply',
    used: 'Used',
    detailInfo: 'Detail Information',
    tokenStats: 'Token Statistics',
    dailyDetail: 'Daily Detail',
    modelStats: 'Model Usage Statistics',
    // Table headers
    date: 'Date',
    model: 'Model',
    requests: 'Requests',
    inputTokens: 'Input Tokens',
    outputTokens: 'Output Tokens',
    cacheCreationTokens: 'Cache Creation',
    cacheReadTokens: 'Cache Read',
    cacheWriteTokens: 'Cache Write',
    totalTokens: 'Total Tokens',
    cost: 'Cost',
    // Status
    quotaMode: 'Key Quota Mode',
    walletBalance: 'Wallet Balance',
    // Ring card titles
    totalQuota: 'Total Quota',
    limit5h: '5-Hour Limit',
    limitDaily: 'Daily Limit',
    limit7d: '7-Day Limit',
    limitWeekly: 'Weekly Limit',
    limitMonthly: 'Monthly Limit',
    // Detail rows
    remainingQuota: 'Remaining Quota',
    expiresAt: 'Expires At',
    todayExpires: '(expires today)',
    daysLeft: '({days} days)',
    usedQuota: 'Used Quota',
    resetNow: 'Resetting soon',
    subscriptionType: 'Subscription Type',
    subscriptionExpires: 'Subscription Expires',
    // Usage stat cells
    todayRequests: 'Today Requests',
    todayInputTokens: 'Today Input',
    todayOutputTokens: 'Today Output',
    todayTokens: 'Today Tokens',
    todayCacheCreation: 'Today Cache Creation',
    todayCacheRead: 'Today Cache Read',
    todayCost: 'Today Cost',
    rpmTpm: 'RPM / TPM',
    totalRequests: 'Total Requests',
    totalInputTokens: 'Total Input',
    totalOutputTokens: 'Total Output',
    totalTokensLabel: 'Total Tokens',
    totalCacheCreation: 'Total Cache Creation',
    totalCacheRead: 'Total Cache Read',
    totalCost: 'Total Cost',
    avgDuration: 'Avg Duration',
    // Messages
    enterApiKey: 'Please enter an API Key',
    querySuccess: 'Query successful',
    queryFailed: 'Query failed',
    queryFailedRetry: 'Query failed, please try again later',
    noDailyUsage: 'No daily usage data',
  },

  // Setup Wizard
  setup: {
    title: 'OriginCoder Setup',
    description: 'Configure your OriginCoder instance',
    database: {
      title: 'Database Configuration',
      description: 'Connect to your PostgreSQL database',
      host: 'Host',
      port: 'Port',
      username: 'Username',
      password: 'Password',
      databaseName: 'Database Name',
      sslMode: 'SSL Mode',
      passwordPlaceholder: 'Password',
      ssl: {
        disable: 'Disable',
        require: 'Require',
        verifyCa: 'Verify CA',
        verifyFull: 'Verify Full'
      }
    },
    redis: {
      title: 'Redis Configuration',
      description: 'Connect to your Redis server',
      host: 'Host',
      port: 'Port',
      username: 'Username (optional)',
      password: 'Password (optional)',
      database: 'Database',
      usernamePlaceholder: 'Leave empty for default user',
      passwordPlaceholder: 'Password',
      enableTls: 'Enable TLS',
      enableTlsHint: 'Use TLS when connecting to Redis (public CA certs)'
    },
    admin: {
      title: 'Admin Account',
      description: 'Create your administrator account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      passwordPlaceholder: 'Min 8 characters',
      confirmPasswordPlaceholder: 'Confirm password',
      passwordMismatch: 'Passwords do not match'
    },
    ready: {
      title: 'Ready to Install',
      description: 'Review your configuration and complete setup',
      database: 'Database',
      redis: 'Redis',
      adminEmail: 'Admin Email'
    },
    status: {
      testing: 'Testing...',
      success: 'Connection Successful',
      testConnection: 'Test Connection',
      installing: 'Installing...',
      completeInstallation: 'Complete Installation',
      completed: 'Installation completed!',
      redirecting: 'Redirecting to login page...',
      restarting: 'Service is restarting, please wait...',
      timeout: 'Service restart is taking longer than expected. Please refresh the page manually.'
    }
  },

  // Common
}
