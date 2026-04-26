// src/config/content.ts
// Section copy for all pages.
// No hero or marketing sections — the product catalogue IS the landing page.
// Import: import { content } from '@/config/content'

export const content = {
  // ─── CATEGORY PAGE HEADERS ──────────────────────────────────────────────
  // Used by each tool category page to render its header block + subcategory filters

  categoryPages: {
    financialTools: {
      badge: 'Core Valuation Toolkit',
      heading: 'Financial Tools',
      subheading: 'Cost of capital, utilities, and valuation workflows.',
      subcategories: ['All tools', 'Cost of Capital', 'Utilities', 'Valuation'],
    },
    industry: {
      badge: 'Market Reference Library',
      heading: 'Industry',
      subheading: 'Benchmarks, spreads, risk premia, and operating ratios.',
      subcategories: ['All tools', 'Benchmarks & Multiples', 'Credit & Risk'],
    },
    macro: {
      badge: 'Rates and Country Context',
      heading: 'Macro',
      subheading: 'Risk-free rates, sovereign context, and economic indicators.',
      subcategories: ['All tools', 'Rates', 'Country & Economic'],
    },
    classification: {
      badge: 'Code Systems and Definitions',
      heading: 'Classification',
      subheading: 'Company descriptions and classification systems.',
      subcategories: ['All tools', 'Company Context', 'Codes'],
    },
    salary: {
      badge: 'Compensation Benchmarks',
      heading: 'Salary',
      subheading: 'Compensation references and valuation support.',
      subcategories: ['All tools', 'Benchmarks', 'Valuation Support'],
    },
    otherTools: {
      badge: 'Extended Analysis Utilities',
      heading: 'Other Tools',
      subheading: 'Specialised workflows and reporting utilities.',
      subcategories: ['All tools', 'Analysis', 'Reporting'],
    },
  },

  // ─── ABOUT PAGE ─────────────────────────────────────────────────────────

  about: {
    badge: 'Our mission',
    heading: 'Built for Canadian valuation professionals',
    body: [
      'CostKit started with a simple frustration: the tools Canadian CBVs rely on every day are scattered across expensive U.S.-centric platforms, government websites, and proprietary databases — none of which were designed with the Canadian private-company valuation workflow in mind.',
      'We are building the default working page for small and mid-sized Canadian valuation firms. One place for cost of capital, industry benchmarks, salary references, classification tools, and analyst utilities — at a price that makes sense for boutique firms.',
      'Every data source, methodology note, and output is built to be defensible. Analyst judgement remains yours. CostKit handles the data gathering and reference work so you can focus on the analysis.',
    ],
    team: {
      heading: 'Built by practitioners',
      body: 'CostKit is built by a CBV-domain operator with direct experience in Canadian private-company valuation. We do not outsource domain decisions.',
    },
    contact: {
      heading: 'Get in touch',
      body: 'Questions about data sources, methodology, pricing, or partnerships — we respond within one business day.',
      email: 'hello@costkit.com',
      cta: { label: 'Contact us', href: '/contact' },
    },
  },

  // ─── CONTACT PAGE ───────────────────────────────────────────────────────

  contact: {
    badge: 'Contact',
    heading: 'We respond within one business day',
    subheading:
      'Questions about data sources, methodology, pricing, or your account — reach out directly.',
    form: {
      namePlaceholder: 'Your name',
      emailPlaceholder: 'Your work email',
      messagePlaceholder: 'What would you like to know?',
      submitLabel: 'Send message',
      successMessage: "Message sent — we'll be in touch shortly.",
      errorMessage: 'Something went wrong. Please try again or email us directly.',
    },
    directEmail: 'hello@costkit.com',
  },

  // ─── PRICING PAGE ───────────────────────────────────────────────────────

  pricing: {
    badge: 'Pricing',
    heading: 'Straightforward pricing for valuation firms',
    subheading:
      'Access the tools your firm actually uses — at a fraction of legacy platform costs. Cancel any time.',
    toggle: {
      monthly: 'Monthly',
      annual: 'Annual',
      savingsLabel: 'Save 17%',
    },
    faq: [
      {
        question: 'What is included in the Free tier?',
        answer:
          'Free tools include public data pages, simple yield and FX lookups, tax tables, basic classification lookups, and limited calculator runs. No credit card required.',
      },
      {
        question: 'How many seats are included in Pro?',
        answer:
          'Pro Firm includes up to 5 seats. All seats share the same subscription and have full access to Pro tools. Additional seats can be added — contact us for team pricing.',
      },
      {
        question: 'Can I use CostKit outputs in client reports?',
        answer:
          'Yes. Outputs are designed to be report-ready. CostKit provides source trail, methodology notes, and transparent data references. Final analyst judgement remains yours.',
      },
      {
        question: 'What data sources does CostKit use?',
        answer:
          'We draw on Bank of Canada, Statistics Canada, public market data, Damodaran datasets, and other authoritative sources. Each tool documents its sources inline.',
      },
      {
        question: 'Is my data private?',
        answer:
          'Yes. Your saved projects, inputs, and outputs are private to your account. We do not share or sell firm data. See our Privacy Policy for full details.',
      },
      {
        question: 'How do I cancel?',
        answer:
          'Cancel any time from your billing page. Your access continues until the end of your current billing period. We do not offer prorated refunds on annual plans.',
      },
      {
        question: 'Do you offer a free trial?',
        answer:
          'The Free tier gives you permanent access to core tools with no time limit. Paid features can be trialled — see the specific offer page for trial terms.',
      },
      {
        question: 'Is CostKit built for Canadian firms specifically?',
        answer:
          'Yes. All cost of capital inputs, risk-free rates, tax tables, salary benchmarks, and reference data are Canadian-first. U.S. data is available where relevant for cross-border work.',
      },
    ],
    cta: {
      heading: 'Start with the Free tier today',
      subheading: 'No credit card required. Upgrade when your firm is ready.',
      primary: { label: 'Create free account', href: '/signup' },
      secondary: { label: 'See all tools', href: '/financial-tools' },
      finePrint:
        'Free tier available indefinitely. Pro billed monthly or annually. Cancel any time.',
    },
  },

  // ─── TOOL PAGE (shared UI copy) ─────────────────────────────────────────
  // Used by all individual tool pages for shared UI labels and error states

  tool: {
    openToolLabel: 'Open Tool →',
    backLabel: '← Back',
    runLabel: 'Run analysis',
    loadingLabel: 'Analysing…',
    exportLabel: 'Export to Excel',
    copyLabel: 'Copy result',
    saveLabel: 'Save to project',
    proLabel: 'PRO',
    freeLabel: 'FREE',
    professionalLabel: 'PROFESSIONAL',
    errorGeneric: 'Something went wrong. Please try again.',
    errorRateLimit: 'You have reached your usage limit. Upgrade to Pro for unlimited access.',
    errorSubscription: 'This tool requires a Pro subscription. Upgrade to unlock.',
    methodologyLabel: 'Methodology & sources',
    assumptionsLabel: 'Assumptions',
    resultsLabel: 'Results',
    inputsLabel: 'Inputs',
    overrideLabel: 'Override',
    overrideTooltip: 'Analyst override — your judgement takes precedence. Document your rationale.',
    auditTrailLabel: 'Source trail',
  },

  // ─── FOOTER ─────────────────────────────────────────────────────────────

  footer: {
    tagline: 'The working page for Canadian valuation professionals.',
    copyright: `© ${new Date().getFullYear()} CostKit. All rights reserved.`,
    columns: [
      {
        heading: 'Tools',
        links: [
          { label: 'Financial Tools', href: '/financial-tools' },
          { label: 'Industry', href: '/industry' },
          { label: 'Macro', href: '/macro' },
          { label: 'Classification', href: '/classification' },
          { label: 'Salary', href: '/salary' },
          { label: 'Other Tools', href: '/other-tools' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Refund Policy', href: '/refund-policy' },
          { label: 'Acceptable Use', href: '/acceptable-use' },
        ],
      },
    ],
    social: [
      { platform: 'Twitter', href: '' },
      { platform: 'LinkedIn', href: '' },
    ],
    disclaimer:
      'CostKit provides reference data and analytical tools to support professional judgement. Outputs are not a substitute for analyst review and should not be relied upon as final valuation conclusions. All data sources are documented within each tool.',
  },
} as const

export type Content = typeof content
