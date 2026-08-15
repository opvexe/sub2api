export default {
  batchImageGuide: {
    title: '图片批量生成',
    description: '一次提交多条提示词，任务完成后可统一下载图片结果'
  },
  // Home Page
  home: {
    nav: {
      primary: '主导航',
      features: '核心能力',
      comparison: '优势对比',
      models: '支持模型',
      reputation: '服务口碑',
      service: 'API 服务',
      guarantees: '服务保障'
    },
    highlights: '平台优势',
    brandCaption: 'Claude · OpenAI 统一网关',
    productTagline: 'Claude 与 OpenAI 系模型的统一 API 网关',
    viewOnGithub: '在 GitHub 上查看',
    viewDocs: '查看文档',
    docs: '文档',
    switchToLight: '切换到浅色模式',
    switchToDark: '切换到深色模式',
    dashboard: '控制台',
    login: '登录',
    getStarted: '立即开始',
    goToDashboard: '进入控制台',
    // 新增：面向用户的价值主张
    heroSubtitle: '一个密钥，畅用多个 AI 模型',
    heroEyebrow: 'OriginCoder · 专注稳定的 AI API 服务',
    heroTitleLead: '稳定可靠的 API',
    heroTitleAccent: '值得长期信赖',
    heroDescription: 'OriginCoder 统一接入 Claude、GPT、Gemini 等主流模型，以透明状态、清晰计费和可达客服，让个人开发者与团队放心长期使用。',
    heroTrust: {
      status: '服务状态透明',
      billing: '每笔费用可查',
      support: '问题有人响应'
    },
    // 首页（OriginCoder 官网版式）
    landing: {
      nav: {
        models: '模型列表',
        pricing: '定价',
        docs: '使用文档',
        architecture: '架构',
        contact: '联系我们'
      },
      hero: {
        badgeCompatible: 'OpenAI 兼容',
        badgeUsd: '美元计价',
        badgeCancel: '随时取消',
        badgeFable: '满血稳定 Fable 5',
        headline: 'One API.',
        headlineAccent: 'Every AI Model.',
        lead: '统一网关，接入 Claude、GPT、Gemini、DeepSeek 等数十种模型。改一行代码即可切换服务商，账单合并到一处结算。',
        ctaPrimary: '查看定价',
        ctaSecondary: '阅读快速上手',
        stats: {
          modelsValue: '60+',
          modelsLabel: '可用模型',
          uptimeValue: '99.9%',
          uptimeLabel: '可用性目标',
          oneValue: '1',
          oneLabel: '密钥 · 端点 · 账单'
        }
      },
      paths: {
        eyebrow: '常见用法',
        title: '按你实际在用的客户端接入。',
        lead: 'OriginCoder 是一个自定义的 OpenAI 兼容 API，编程 Agent、聊天客户端、命令行工具和你自己的应用都能直接用。',
        action: '查看配置',
        agents: {
          title: '编程 Agent',
          desc: 'Cursor、Cline、Roo Code、Kilo Code、Continue、Zed，以及任何支持自定义 OpenAI 兼容地址的编辑器。'
        },
        chat: {
          title: '聊天客户端',
          desc: 'LibreChat、LobeChat、Open WebUI、Chatbox 等通用 OpenAI 兼容前端，无需适配层。'
        },
        cli: {
          title: '命令行工具',
          desc: 'Claude Code、Codex CLI、Gemini CLI、Aider 等终端 Agent，直接读取环境变量里的同一把密钥。'
        },
        apps: {
          title: '你自己的应用',
          desc: '保留现有的 OpenAI SDK 调用，Python、Node、Go 都一样。只换 Base URL 和模型名，其余代码照旧。'
        }
      },
      developer: {
        eyebrow: '开发者优先',
        title: '几秒完成接入。',
        titleAccent: '然后专注于构建。',
        lead: '完全兼容 OpenAI 端点。切换服务商无需改动代码，一把密钥通用所有模型。',
        codeLabel: 'Bash · curl',
        copy: '复制',
        copied: '已复制',
        endpoints: {
          title: 'OpenAI 兼容端点',
          desc: '可直接配合 Python、Node、Go 等官方 OpenAI SDK 使用。'
        },
        failover: {
          title: '自动故障转移',
          desc: '上游异常时自动绕行，而不是把错误抛给你。'
        },
        protocol: {
          title: '多协议支持',
          desc: '流式响应、函数调用与向量化全链路支持。'
        },
        records: {
          title: '逐请求用量记录',
          desc: '每次调用的 token 数与费用都有记录，可导出对账。'
        }
      },
      architecture: {
        eyebrow: '架构',
        lifecycle: '请求生命周期',
        active: '运行中',
        step1: { title: '统一端点', desc: '一个接口同时承接 OpenAI、Anthropic 与 Gemini 三种请求格式。' },
        step2: { title: '智能路由', desc: '按实时延迟与可用性挑选当前最快的健康上游。' },
        step3: { title: '自动故障转移', desc: '失败的请求立刻改走其他可用渠道。' },
        delivered: { value: '99.9%', title: '稳定送达。', desc: '全部模型的可用性目标。' },
        formats: '支持的请求格式',
        autoDetected: '自动识别',
        formatsNote: '三种请求格式自动识别并路由到对应上游，你可以继续用项目里已有的 SDK，不必重写客户端。',
        formatsCount: { value: '3', title: '种请求格式。', desc: '每次调用自动判别。' }
      },
      finalCta: {
        eyebrow: '准备开始',
        title: '准备好开始构建了吗？',
        lead: '一把密钥、一个端点、一份账单。选好套餐，五分钟内发出第一次调用。',
        primary: '选择套餐',
        secondary: '联系我们'
      },
      footer: {
        brandDesc: '一个端点、一把密钥、一份账单，覆盖主流 AI 模型。由在美国注册的 Fvawi Drein INC 运营。',
        product: '产品',
        support: '支持',
        legal: '协议',
        models: '模型',
        pricing: '定价',
        console: '控制台',
        docs: '文档',
        status: '服务状态',
        contact: '联系我们',
        faq: '常见问题',
        payments: '支付方式',
        paymentsLead: '所有价格以 { currency } 标价并结算，不含税费。',
        currency: '美元（USD）',
        stripeTitle: '银行卡 —— Visa、Mastercard、American Express',
        stripeDesc: '由 Stripe, Inc. 安全处理。我们不接触也不存储完整卡号。订阅按月自动续费，可随时在控制台取消。',
        usdtTitle: 'USDT —— TRC20 与 ERC20',
        usdtDesc: '手动预充值，链上确认后到账。一次性支付、不自动续费，确认后不可退款。请仅通过列出的网络转入 USDT。',
        disclaimer: 'OriginCoder 是一个独立平台，与 Anthropic、OpenAI、Google、Meta 或任何其他模型提供商均无关联，也未获得其认可或赞助；所有商标归各自所有者。模型输出由第三方提供商生成，可能不准确，请在依赖前自行核实。'
      }
    },
    tags: {
      subscriptionToApi: '订阅转 API',
      stickySession: '会话保持',
      realtimeBilling: '按量计费'
    },
    // 用户痛点区块
    painPoints: {
      title: '你是否也遇到这些问题？',
      items: {
        expensive: {
          title: '订阅费用高',
          desc: '每个 AI 服务都要单独订阅，每月支出越来越多'
        },
        complex: {
          title: '多账号难管理',
          desc: '不同平台的账号、密钥分散各处，管理起来很麻烦'
        },
        unstable: {
          title: '服务不稳定',
          desc: '单一账号容易触发限制，影响正常使用'
        },
        noControl: {
          title: '用量无法控制',
          desc: '不知道钱花在哪了，也无法限制团队成员的使用'
        }
      }
    },
    // 解决方案区块
    solutions: {
      title: '从接入到计费，一个平台完成',
      subtitle: '核心产品能力'
    },
    features: {
      unifiedGateway: '统一 API 网关',
      unifiedGatewayDesc: '只需一个接口和一套密钥，即可调用所有已接入模型，现有应用无需反复改造。',
      multiAccount: '智能路由与故障切换',
      multiAccountDesc: '根据模型健康状态与负载自动选择上游，异常时快速切换，保持请求稳定。',
      balanceQuota: '实时计费与用量控制',
      balanceQuotaDesc: '按实际调用量计费，支持配额限制与消费明细，团队成本随时可查。',
      endpoint: '统一接口地址',
      openaiCompatible: '兼容 OpenAI 接口',
      poolHealthy: '上游账号池运行正常'
    },
    // 优势对比
    comparison: {
      eyebrow: '更简单的 AI 接入方式',
      title: '为什么选择我们？',
      description: '把分散的订阅、密钥和账单统一到一个入口，减少维护成本，让团队专注于产品本身。',
      headers: {
        feature: '对比项',
        official: '官方订阅',
        us: '本平台'
      },
      items: {
        pricing: {
          feature: '付费方式',
          official: '固定月费，用不完也付',
          us: '按量付费，用多少付多少'
        },
        models: {
          feature: '模型选择',
          official: '单一服务商',
          us: '多模型随意切换'
        },
        management: {
          feature: '账号管理',
          official: '每个服务单独管理',
          us: '统一密钥，一站管理'
        },
        stability: {
          feature: '服务稳定性',
          official: '单账号易触发限制',
          us: '多账号池，自动切换'
        },
        control: {
          feature: '用量控制',
          official: '无法限制',
          us: '可设配额、查明细'
        }
      }
    },
    providers: {
      title: '已支持的 AI 模型',
      description: '一个 API，多种选择',
      supported: '已支持',
      soon: '即将推出',
      claude: 'Claude',
      gemini: 'Gemini',
      antigravity: 'Antigravity',
      more: '更多'
    },
    preview: {
      console: '实时请求',
      status: '状态',
      route: '路由',
      latency: '延迟',
      smartRouting: '智能路由已启用',
      smartRoutingDesc: '根据可用性与负载自动选择最佳上游',
      healthy: '运行正常',
      gatewayTitle: '统一 AI 网关',
      gatewaySubtitle: '请求接入、模型路由与计费',
      clientRequest: '你的应用发起请求',
      upstreamPool: '可用模型池',
      available: '可用',
      auto: '自动调度',
      oneKey: '统一密钥',
      failover: '故障切换',
      billing: '实时计费'
    },
    liveMetrics: {
      title: '今日模型调用量',
      live: '实时更新',
      unit: '次模型调用，正在持续增长',
      updated: '今日调用趋势'
    },
    modelStatus: {
      title: '模型状态',
      description: '主流模型连接状态一目了然',
      allOperational: '全部正常',
      operational: '运行正常'
    },
    servicePreview: {
      console: '服务运行面板',
      live: '监测中',
      title: '服务保障机制',
      allHealthy: '稳定链路，持续守护',
      formats: {
        title: '支持的 API 格式',
        openai: 'OpenAI 格式',
        claude: 'Claude 格式',
        gemini: 'Gemini 格式'
      },
      route: '请求路由',
      yourApp: '你的应用',
      bestRoute: '智能上游',
      normal: '已启用',
      events: {
        health: {
          title: '上游健康持续检查',
          description: '根据实时可用性评估服务线路'
        },
        routing: {
          title: '智能路由与自动切换',
          description: '线路异常时选择可用上游'
        },
        billing: {
          title: '请求级用量记录',
          description: '模型、Token 与费用明细可查询'
        }
      }
    },
    trustBar: {
      title: '值得信赖的服务基础',
      items: {
        monitoring: {
          title: '健康检查',
          description: '上游异常会在下一次调用前被剔除'
        },
        records: {
          title: '逐请求记账',
          description: '每笔调用的 token 与费用都可回溯'
        },
        failover: {
          title: '自动故障切换',
          description: '一路上游不可用时请求转到下一路'
        },
        support: {
          title: '人工可达',
          description: 'Telegram 与 Discord 有人值守'
        }
      }
    },
    reputation: {
      eyebrow: '口碑如何建立',
      title: '口碑不是一句广告，是每次调用都让人放心',
      description: '能长期使用的 API 服务，不只要模型多，更要状态说清楚、费用算清楚、问题有人处理。',
      items: {
        transparent: {
          title: '服务状态不藏着',
          description: '健康状态、异常与路由结果清晰可见，服务是否可用心里有数。',
          proof: '运行状态可持续查询'
        },
        billing: {
          title: '每一笔费用都讲得清',
          description: '按请求记录模型、Token 和费用明细，团队成本不再是一笔糊涂账。',
          proof: '用量明细随时可查'
        },
        support: {
          title: '遇到问题找得到人',
          description: '多渠道客服覆盖购买前咨询和使用中问题，不让反馈石沉大海。',
          proof: 'Telegram 与 Discord 可联系'
        }
      },
      promiseEyebrow: '我们的原则',
      promiseTitle: 'OriginCoder 服务承诺',
      promiseDescription: '信任不是靠夸张数字，而是靠长期一致的服务体验。',
      commitments: {
        status: '不隐瞒服务状态',
        billing: '不做模糊计费',
        support: '不让用户的问题石沉大海',
        choice: '不用复杂规则限制选择'
      },
      promiseFooter: '长期主义，认真服务每一次调用'
    },
    // CTA 区块
    cta: {
      title: '把稳定的 API 服务，交给 OriginCoder',
      description: '从第一把密钥开始，体验透明、稳定、有人负责的 AI API 服务。',
      button: '免费注册'
    },
    footer: {
      allRightsReserved: '保留所有权利。',
      description: 'Claude 与 OpenAI 系模型的统一网关，同时兼容 OpenAI 与 Anthropic 协议。',
      contact: '联系我们',
      contactDescription: 'Telegram、Discord 客服随时可达',
      slogan: 'origincoder.com/v1',
      navigation: '快速导航'
    },
    community: {
      openSupport: '打开客服渠道',
      support: '客服',
      title: '联系 OriginCoder',
      description: 'Telegram、Discord 客服渠道',
      online: '在线',
      telegram: 'Telegram 客服',
      telegramDescription: '即时咨询与接入帮助',
      discord: 'Discord 社区',
      discordDescription: '交流、公告与问题反馈'
    }
  },

  // Key Usage Query Page
  keyUsage: {
    title: 'API Key 用量查询',
    subtitle: '输入您的 API Key 以查看实时消费金额与使用状态',
    placeholder: 'sk-ant-mirror-xxxxxxxxxxxx',
    query: '查询',
    querying: '查询中...',
    privacyNote: '您的 Key 仅在浏览器本地处理，不会被存储',
    dateRange: '统计范围:',
    dateRangeToday: '今日',
    dateRange7d: '7 天',
    dateRange30d: '30 天',
    dateRange90d: '90 天',
    dateRangeCustom: '自定义',
    apply: '应用',
    used: '已使用',
    detailInfo: '详细信息',
    tokenStats: 'Token 统计',
    dailyDetail: '按日明细',
    modelStats: '模型用量统计',
    // Table headers
    date: '日期',
    model: '模型',
    requests: '请求数',
    inputTokens: '输入 Tokens',
    outputTokens: '输出 Tokens',
    cacheCreationTokens: '缓存创建',
    cacheReadTokens: '缓存读取',
    cacheWriteTokens: '缓存写入',
    totalTokens: '总 Tokens',
    cost: '费用',
    // Status
    quotaMode: 'Key 限额模式',
    walletBalance: '钱包余额',
    // Ring card titles
    totalQuota: '总额度',
    limit5h: '5 小时限额',
    limitDaily: '日限额',
    limit7d: '7 天限额',
    limitWeekly: '周限额',
    limitMonthly: '月限额',
    // Detail rows
    remainingQuota: '剩余额度',
    expiresAt: '过期时间',
    todayExpires: '(今日到期)',
    daysLeft: '({days} 天)',
    usedQuota: '已用额度',
    resetNow: '即将重置',
    subscriptionType: '订阅类型',
    subscriptionExpires: '订阅到期',
    // Usage stat cells
    todayRequests: '今日请求',
    todayInputTokens: '今日输入',
    todayOutputTokens: '今日输出',
    todayTokens: '今日 Tokens',
    todayCacheCreation: '今日缓存创建',
    todayCacheRead: '今日缓存读取',
    todayCost: '今日费用',
    rpmTpm: 'RPM / TPM',
    totalRequests: '累计请求',
    totalInputTokens: '累计输入',
    totalOutputTokens: '累计输出',
    totalTokensLabel: '累计 Tokens',
    totalCacheCreation: '累计缓存创建',
    totalCacheRead: '累计缓存读取',
    totalCost: '累计费用',
    avgDuration: '平均耗时',
    // Messages
    enterApiKey: '请输入 API Key',
    querySuccess: '查询成功',
    queryFailed: '查询失败',
    queryFailedRetry: '查询失败，请稍后重试',
    noDailyUsage: '暂无按日用量数据',
  },

  // Setup Wizard
  setup: {
    title: 'OriginCoder 安装向导',
    description: '配置您的 OriginCoder 实例',
    database: {
      title: '数据库配置',
      description: '连接到您的 PostgreSQL 数据库',
      host: '主机',
      port: '端口',
      username: '用户名',
      password: '密码',
      databaseName: '数据库名称',
      sslMode: 'SSL 模式',
      passwordPlaceholder: '密码',
      ssl: {
        disable: '禁用',
        require: '要求',
        verifyCa: '验证 CA',
        verifyFull: '完全验证'
      }
    },
    redis: {
      title: 'Redis 配置',
      description: '连接到您的 Redis 服务器',
      host: '主机',
      port: '端口',
      username: '用户名（可选）',
      password: '密码（可选）',
      database: '数据库',
      usernamePlaceholder: '默认用户留空',
      passwordPlaceholder: '密码',
      enableTls: '启用 TLS',
      enableTlsHint: '连接 Redis 时使用 TLS（公共 CA 证书）'
    },
    admin: {
      title: '管理员账户',
      description: '创建您的管理员账户',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      passwordPlaceholder: '至少 8 个字符',
      confirmPasswordPlaceholder: '确认密码',
      passwordMismatch: '密码不匹配'
    },
    ready: {
      title: '准备安装',
      description: '检查您的配置并完成安装',
      database: '数据库',
      redis: 'Redis',
      adminEmail: '管理员邮箱'
    },
    status: {
      testing: '测试中...',
      success: '连接成功',
      testConnection: '测试连接',
      installing: '安装中...',
      completeInstallation: '完成安装',
      completed: '安装完成！',
      redirecting: '正在跳转到登录页面...',
      restarting: '服务正在重启，请稍候...',
      timeout: '服务重启时间超出预期，请手动刷新页面。'
    }
  },

  // Common
}
