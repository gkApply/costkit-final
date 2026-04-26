// src/config/tools.ts
// Central tool registry for CostKit.
// Every tool card across all category pages is driven from this file.
// Import: import { tools, getToolsByCategory, getToolBySlug } from '@/config/tools'

export type ToolTier = 'free' | 'pro' | 'professional'

export type Tool = {
  id: string
  slug: string
  category: string // matches route segment e.g. 'financial-tools'
  subcategory: string // used for filter pills on category pages
  title: string
  description: string // one sentence — shown on card
  href: string // full route path
  tier: ToolTier
  icon: string // lucide-react icon name
  comingSoon?: boolean
}

export const tools: Tool[] = [
  // ── FINANCIAL TOOLS — Cost of Capital ──────────────────────────────────

  {
    id: 'wacc-calculator',
    slug: 'wacc-calculator',
    category: 'financial-tools',
    subcategory: 'Cost of Capital',
    title: 'WACC Calculator',
    description: 'Weighted average cost of capital workflow.',
    href: '/financial-tools/wacc-calculator',
    tier: 'free',
    icon: 'Calculator',
  },
  {
    id: 'cost-of-equity',
    slug: 'cost-of-equity',
    category: 'financial-tools',
    subcategory: 'Cost of Capital',
    title: 'Cost of Equity',
    description: 'CAPM and build-up cost of equity.',
    href: '/financial-tools/cost-of-equity',
    tier: 'free',
    icon: 'TrendingUp',
  },
  {
    id: 'beta-unlever-relever',
    slug: 'beta-unlever-relever',
    category: 'financial-tools',
    subcategory: 'Cost of Capital',
    title: 'Beta Unlever / Relever',
    description: 'Peer beta adjustment flow.',
    href: '/financial-tools/beta-unlever-relever',
    tier: 'free',
    icon: 'ArrowLeftRight',
  },

  // ── FINANCIAL TOOLS — Utilities ─────────────────────────────────────────

  {
    id: 'currency-converter',
    slug: 'currency-converter',
    category: 'financial-tools',
    subcategory: 'Utilities',
    title: 'Currency Converter',
    description: 'Exchange-rate conversion workspace.',
    href: '/financial-tools/currency-converter',
    tier: 'free',
    icon: 'ArrowRightLeft',
  },
  {
    id: 'life-tables',
    slug: 'life-tables',
    category: 'financial-tools',
    subcategory: 'Utilities',
    title: 'Life Tables',
    description: 'Mortality and life expectancy reference.',
    href: '/financial-tools/life-tables',
    tier: 'free',
    icon: 'BookOpen',
  },
  {
    id: 'tax-tables',
    slug: 'tax-tables',
    category: 'financial-tools',
    subcategory: 'Utilities',
    title: 'Tax Tables',
    description: 'Corporate tax rate reference.',
    href: '/financial-tools/tax-tables',
    tier: 'free',
    icon: 'Percent',
  },

  // ── FINANCIAL TOOLS — Valuation ─────────────────────────────────────────

  {
    id: 'dcf-calculator',
    slug: 'dcf-calculator',
    category: 'financial-tools',
    subcategory: 'Valuation',
    title: 'DCF Calculator',
    description: 'Multi-stage discounted cash flow model.',
    href: '/financial-tools/dcf-calculator',
    tier: 'pro',
    icon: 'LineChart',
  },
  {
    id: 'terminal-value',
    slug: 'terminal-value',
    category: 'financial-tools',
    subcategory: 'Valuation',
    title: 'Terminal Value',
    description: 'Exit and perpetual method comparisons.',
    href: '/financial-tools/terminal-value',
    tier: 'pro',
    icon: 'Target',
  },

  // ── INDUSTRY — Benchmarks & Multiples ──────────────────────────────────

  {
    id: 'industry-metrics',
    slug: 'industry-metrics',
    category: 'industry',
    subcategory: 'Benchmarks & Multiples',
    title: 'Industry Metrics',
    description: 'Financial metrics by industry.',
    href: '/industry/industry-metrics',
    tier: 'free',
    icon: 'BarChart2',
  },
  {
    id: 'ratio-benchmarks',
    slug: 'ratio-benchmarks',
    category: 'industry',
    subcategory: 'Benchmarks & Multiples',
    title: 'Ratio Benchmarks',
    description: 'Margin, leverage, and return quartiles.',
    href: '/industry/ratio-benchmarks',
    tier: 'free',
    icon: 'BarChart3',
  },
  {
    id: 'historical-trends',
    slug: 'historical-trends',
    category: 'industry',
    subcategory: 'Benchmarks & Multiples',
    title: 'Historical Trends',
    description: 'Multi-year sector trend analysis.',
    href: '/industry/historical-trends',
    tier: 'pro',
    icon: 'TrendingUp',
  },

  // ── INDUSTRY — Credit & Risk ────────────────────────────────────────────

  {
    id: 'credit-spreads',
    slug: 'credit-spreads',
    category: 'industry',
    subcategory: 'Credit & Risk',
    title: 'Credit Spreads',
    description: 'Corporate spreads by rating.',
    href: '/industry/credit-spreads',
    tier: 'free',
    icon: 'Activity',
  },
  {
    id: 'industry-risk-premium',
    slug: 'industry-risk-premium',
    category: 'industry',
    subcategory: 'Credit & Risk',
    title: 'Industry Risk Premium',
    description: 'Build-up method premia by industry.',
    href: '/industry/industry-risk-premium',
    tier: 'pro',
    icon: 'ShieldAlert',
  },

  // ── MACRO — Rates ───────────────────────────────────────────────────────

  {
    id: 'us-risk-free-rate',
    slug: 'us-risk-free-rate',
    category: 'macro',
    subcategory: 'Rates',
    title: 'US Risk-Free Rate',
    description: 'Treasury curve snapshots.',
    href: '/macro/us-risk-free-rate',
    tier: 'free',
    icon: 'Landmark',
  },
  {
    id: 'canada-risk-free-rate',
    slug: 'canada-risk-free-rate',
    category: 'macro',
    subcategory: 'Rates',
    title: 'Canada Risk-Free Rate',
    description: 'GoC yields across maturities.',
    href: '/macro/canada-risk-free-rate',
    tier: 'free',
    icon: 'Landmark',
  },

  // ── MACRO — Country & Economic ──────────────────────────────────────────

  {
    id: 'country-ratings',
    slug: 'country-ratings',
    category: 'macro',
    subcategory: 'Country & Economic',
    title: 'Country Ratings',
    description: 'Sovereign ratings and country risk.',
    href: '/macro/country-ratings',
    tier: 'free',
    icon: 'Globe',
  },
  {
    id: 'cpi',
    slug: 'cpi',
    category: 'macro',
    subcategory: 'Country & Economic',
    title: 'CPI',
    description: 'Inflation reference by country.',
    href: '/macro/cpi',
    tier: 'free',
    icon: 'TrendingUp',
  },
  {
    id: 'gdp-growth',
    slug: 'gdp-growth',
    category: 'macro',
    subcategory: 'Country & Economic',
    title: 'GDP Growth',
    description: 'Growth reference and forecasts.',
    href: '/macro/gdp-growth',
    tier: 'free',
    icon: 'AreaChart',
  },
  {
    id: 'fx-volatility',
    slug: 'fx-volatility',
    category: 'macro',
    subcategory: 'Country & Economic',
    title: 'FX Volatility',
    description: 'Currency volatility metrics.',
    href: '/macro/fx-volatility',
    tier: 'pro',
    icon: 'Waves',
  },

  // ── CLASSIFICATION — Company Context ───────────────────────────────────

  {
    id: 'company-description',
    slug: 'company-description',
    category: 'classification',
    subcategory: 'Company Context',
    title: 'Company Description',
    description: 'Standardised company descriptions.',
    href: '/classification/company-description',
    tier: 'free',
    icon: 'Building2',
  },

  // ── CLASSIFICATION — Codes ──────────────────────────────────────────────

  {
    id: 'naics-codes',
    slug: 'naics-codes',
    category: 'classification',
    subcategory: 'Codes',
    title: 'NAICS Codes',
    description: 'NAICS lookup.',
    href: '/classification/naics-codes',
    tier: 'free',
    icon: 'Hash',
  },
  {
    id: 'sic-codes',
    slug: 'sic-codes',
    category: 'classification',
    subcategory: 'Codes',
    title: 'SIC Codes',
    description: 'SIC lookup.',
    href: '/classification/sic-codes',
    tier: 'free',
    icon: 'Hash',
  },
  {
    id: 'sic-naics-converter',
    slug: 'sic-naics-converter',
    category: 'classification',
    subcategory: 'Codes',
    title: 'SIC / NAICS Converter',
    description: 'Crosswalk conversion.',
    href: '/classification/sic-naics-converter',
    tier: 'free',
    icon: 'Repeat',
  },
  {
    id: 'gics-sectors',
    slug: 'gics-sectors',
    category: 'classification',
    subcategory: 'Codes',
    title: 'GICS Sectors',
    description: 'GICS reference.',
    href: '/classification/gics-sectors',
    tier: 'free',
    icon: 'LayoutGrid',
  },

  // ── SALARY — Benchmarks ─────────────────────────────────────────────────

  {
    id: 'salary-by-role',
    slug: 'salary-by-role',
    category: 'salary',
    subcategory: 'Benchmarks',
    title: 'Salary by Role',
    description: 'Comp by role and geography.',
    href: '/salary/salary-by-role',
    tier: 'pro',
    icon: 'Users',
  },
  {
    id: 'salary-by-industry',
    slug: 'salary-by-industry',
    category: 'salary',
    subcategory: 'Benchmarks',
    title: 'Salary by Industry',
    description: 'Industry-level wage benchmarks.',
    href: '/salary/salary-by-industry',
    tier: 'pro',
    icon: 'Briefcase',
  },
  {
    id: 'executive-compensation',
    slug: 'executive-compensation',
    category: 'salary',
    subcategory: 'Benchmarks',
    title: 'Executive Compensation',
    description: 'Executive compensation ranges.',
    href: '/salary/executive-compensation',
    tier: 'professional',
    icon: 'UserCheck',
  },

  // ── SALARY — Valuation Support ──────────────────────────────────────────

  {
    id: 'reasonable-compensation',
    slug: 'reasonable-compensation',
    category: 'salary',
    subcategory: 'Valuation Support',
    title: 'Reasonable Compensation',
    description: 'Owner-operator compensation support.',
    href: '/salary/reasonable-compensation',
    tier: 'professional',
    icon: 'Scale',
  },

  // ── OTHER TOOLS — Analysis ──────────────────────────────────────────────

  {
    id: 'monte-carlo-simulator',
    slug: 'monte-carlo-simulator',
    category: 'other-tools',
    subcategory: 'Analysis',
    title: 'Monte Carlo Simulator',
    description: 'Probability-based scenario modeling.',
    href: '/other-tools/monte-carlo-simulator',
    tier: 'professional',
    icon: 'Shuffle',
  },
  {
    id: 'sensitivity-analysis',
    slug: 'sensitivity-analysis',
    category: 'other-tools',
    subcategory: 'Analysis',
    title: 'Sensitivity Analysis',
    description: 'Assumption sensitivity testing.',
    href: '/other-tools/sensitivity-analysis',
    tier: 'professional',
    icon: 'Sliders',
  },

  // ── OTHER TOOLS — Reporting ─────────────────────────────────────────────

  {
    id: 'report-builder',
    slug: 'report-builder',
    category: 'other-tools',
    subcategory: 'Reporting',
    title: 'Report Builder',
    description: 'Generate valuation report sections.',
    href: '/other-tools/report-builder',
    tier: 'professional',
    icon: 'FileText',
  },
]

// ── HELPER FUNCTIONS ────────────────────────────────────────────────────────

/** Returns all tools for a given category slug e.g. 'financial-tools' */
export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category)
}

/** Returns tools filtered by category and subcategory */
export function getToolsBySubcategory(category: string, subcategory: string): Tool[] {
  return tools.filter((t) => t.category === category && t.subcategory === subcategory)
}

/** Returns a single tool by its slug */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug)
}

/** Returns all unique subcategories for a given category */
export function getSubcategories(category: string): string[] {
  const subs = tools.filter((t) => t.category === category).map((t) => t.subcategory)
  return ['All tools', ...Array.from(new Set(subs))]
}
