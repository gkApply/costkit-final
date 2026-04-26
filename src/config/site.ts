// src/config/site.ts

export const site = {
  name: 'CostKit',
  tagline: 'Canadian valuation tools built for professionals',
  url: 'https://costkit.com',
  description:
    'Cost of capital calculators, industry benchmarks, and valuation datasets built for Canadian CBVs and analysts. One workspace, no spreadsheet chaos.',
  ogImage: '/og-image.png',

  social: {
    twitter: '',
    github: '',
  },

  nav: {
    links: [
      { label: 'Financial Tools', href: '/financial-tools' },
      { label: 'Industry', href: '/industry' },
      { label: 'Macro', href: '/macro' },
      { label: 'Classification', href: '/classification' },
      { label: 'Salary', href: '/salary' },
      { label: 'Other Tools', href: '/other-tools' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'About', href: '/about' },
    ],
    cta: { label: 'Start free', href: '/signup' },
    login: { label: 'Sign in', href: '/login' },
  },

  meta: {
    '/': {
      title: 'CostKit — Canadian Valuation Tools for Professionals',
      description:
        'WACC calculators, industry benchmarks, risk-free rates, and more. Built for Canadian CBVs and valuation analysts.',
    },
    '/financial-tools': {
      title: 'Financial Tools — CostKit',
      description:
        'Cost of capital, WACC, cost of equity, DCF, and valuation utilities. Free and Pro tools for Canadian valuation professionals.',
    },
    '/financial-tools/wacc-calculator': {
      title: 'WACC Calculator — CostKit',
      description:
        'Weighted average cost of capital workflow with Canadian market inputs. Build and document your WACC in minutes.',
    },
    '/financial-tools/cost-of-equity': {
      title: 'Cost of Equity — CostKit',
      description:
        'CAPM and build-up cost of equity calculations. Supports Canadian risk-free rates and size premia.',
    },
    '/financial-tools/beta-unlever-relever': {
      title: 'Beta Unlever / Relever — CostKit',
      description:
        'Peer beta adjustment workflow. Unlever and relever betas across capital structures with auditable steps.',
    },
    '/financial-tools/currency-converter': {
      title: 'Currency Converter — CostKit',
      description:
        'Real-time and historical exchange-rate conversion workspace for multi-currency valuation engagements.',
    },
    '/financial-tools/life-tables': {
      title: 'Life Tables — CostKit',
      description:
        'Canadian mortality and life expectancy reference data. Actuarial tables for personal injury and loss quantification.',
    },
    '/financial-tools/tax-tables': {
      title: 'Tax Tables — CostKit',
      description:
        'Canadian federal and provincial corporate tax rate reference. Current and historical rates by jurisdiction.',
    },
    '/financial-tools/dcf-calculator': {
      title: 'DCF Calculator — CostKit',
      description:
        'Multi-stage discounted cash flow model with Canadian market defaults. Build, document, and export your DCF.',
    },
    '/financial-tools/terminal-value': {
      title: 'Terminal Value — CostKit',
      description:
        'Exit multiple and perpetuity growth method comparisons. Sensitivity tables included.',
    },
    '/industry': {
      title: 'Industry — CostKit',
      description:
        'Canadian and North American industry benchmarks, operating ratios, credit spreads, and risk premia by sector.',
    },
    '/industry/industry-metrics': {
      title: 'Industry Metrics — CostKit',
      description:
        'Financial metrics by industry. Revenue multiples, EBITDA margins, and leverage ratios by sector.',
    },
    '/industry/ratio-benchmarks': {
      title: 'Ratio Benchmarks — CostKit',
      description:
        'Margin, leverage, and return quartiles by industry. Benchmark any company against sector peers.',
    },
    '/industry/historical-trends': {
      title: 'Historical Trends — CostKit',
      description:
        'Multi-year sector trend analysis. Track how key metrics have shifted across market cycles.',
    },
    '/industry/credit-spreads': {
      title: 'Credit Spreads — CostKit',
      description:
        'Corporate credit spreads by rating category. Current and historical spread data for cost of debt analysis.',
    },
    '/industry/industry-risk-premium': {
      title: 'Industry Risk Premium — CostKit',
      description:
        'Build-up method risk premia by industry. Damodaran-style IRP tables with Canadian context.',
    },
    '/macro': {
      title: 'Macro — CostKit',
      description:
        'Canadian and U.S. risk-free rates, sovereign ratings, CPI, GDP growth, and FX volatility reference data.',
    },
    '/macro/us-risk-free-rate': {
      title: 'US Risk-Free Rate — CostKit',
      description:
        'U.S. Treasury curve snapshots across maturities. Current and historical yields for cross-border valuations.',
    },
    '/macro/canada-risk-free-rate': {
      title: 'Canada Risk-Free Rate — CostKit',
      description:
        'Government of Canada bond yields across maturities. The standard risk-free rate reference for Canadian CBV work.',
    },
    '/macro/country-ratings': {
      title: 'Country Ratings — CostKit',
      description:
        "Sovereign credit ratings and country risk premia. Moody's, S&P, and Fitch ratings with Damodaran CRP estimates.",
    },
    '/macro/cpi': {
      title: 'CPI — CostKit',
      description:
        'Canadian and global inflation reference by country. CPI data for real rate and growth assumption support.',
    },
    '/macro/gdp-growth': {
      title: 'GDP Growth — CostKit',
      description:
        'GDP growth reference and IMF forecasts by country. Anchor your terminal growth rate assumptions to macro data.',
    },
    '/macro/fx-volatility': {
      title: 'FX Volatility — CostKit',
      description:
        'Currency volatility metrics for CAD, USD, and key pairs. Supports FX risk adjustments in cross-border valuations.',
    },
    '/classification': {
      title: 'Classification — CostKit',
      description:
        'NAICS, SIC, and GICS code lookups, crosswalks, and standardised company descriptions for peer selection.',
    },
    '/classification/company-description': {
      title: 'Company Description — CostKit',
      description:
        'Standardised company descriptions for valuation reports. Search by name, ticker, or industry.',
    },
    '/classification/naics-codes': {
      title: 'NAICS Codes — CostKit',
      description:
        'Full NAICS code lookup and hierarchy browser. Find the right code for any industry classification.',
    },
    '/classification/sic-codes': {
      title: 'SIC Codes — CostKit',
      description:
        'SIC code lookup and reference. Essential for Damodaran dataset alignment and peer group construction.',
    },
    '/classification/sic-naics-converter': {
      title: 'SIC / NAICS Converter — CostKit',
      description:
        'Crosswalk converter between SIC and NAICS classification systems. Instant bidirectional lookup.',
    },
    '/classification/gics-sectors': {
      title: 'GICS Sectors — CostKit',
      description:
        'GICS sector and industry group reference. Map companies to the Global Industry Classification Standard.',
    },
    '/salary': {
      title: 'Salary — CostKit',
      description:
        'Canadian compensation benchmarks by role, industry, and geography. Supports reasonable compensation analysis.',
    },
    '/salary/salary-by-role': {
      title: 'Salary by Role — CostKit',
      description:
        'Canadian compensation ranges by role and geography. Sourced from Statistics Canada and industry surveys.',
    },
    '/salary/salary-by-industry': {
      title: 'Salary by Industry — CostKit',
      description:
        'Industry-level wage benchmarks for Canadian sectors. Supports owner-operator compensation adjustments.',
    },
    '/salary/executive-compensation': {
      title: 'Executive Compensation — CostKit',
      description:
        'Executive compensation ranges for Canadian companies by size and sector. Proxy-sourced data.',
    },
    '/salary/reasonable-compensation': {
      title: 'Reasonable Compensation — CostKit',
      description:
        'Owner-operator reasonable compensation analysis support. Document and defend compensation adjustments.',
    },
    '/other-tools': {
      title: 'Other Tools — CostKit',
      description:
        'Monte Carlo simulation, sensitivity analysis, and AI-powered report builder for valuation professionals.',
    },
    '/other-tools/monte-carlo-simulator': {
      title: 'Monte Carlo Simulator — CostKit',
      description:
        'Probability-based scenario modelling for valuation assumptions. Visualise value distributions instantly.',
    },
    '/other-tools/sensitivity-analysis': {
      title: 'Sensitivity Analysis — CostKit',
      description:
        'Assumption sensitivity testing with two-way tables. Understand how value moves with key drivers.',
    },
    '/other-tools/report-builder': {
      title: 'Report Builder — CostKit',
      description:
        'AI-powered valuation report section generator. Draft methodology, assumptions, and conclusion language.',
    },
    '/pricing': {
      title: 'Pricing — CostKit',
      description:
        'Simple, transparent pricing for Canadian valuation professionals. Free tier available. No per-seat surprises.',
    },
    '/about': {
      title: 'About — CostKit',
      description:
        'CostKit is built for Canadian CBVs and valuation analysts. Our mission: consolidate the reference data your work depends on.',
    },
    '/contact': {
      title: 'Contact — CostKit',
      description:
        'Get in touch with the CostKit team. Questions about pricing, features, or data sources — we respond within one business day.',
    },
    '/terms': {
      title: 'Terms of Service — CostKit',
      description: 'CostKit terms of service. Governs your use of the CostKit platform and tools.',
    },
    '/privacy': {
      title: 'Privacy Policy — CostKit',
      description:
        'How CostKit collects, uses, and protects your data. PIPEDA-compliant privacy practices.',
    },
    '/refund-policy': {
      title: 'Refund Policy — CostKit',
      description: 'CostKit refund and cancellation policy for monthly and annual subscriptions.',
    },
    '/acceptable-use': {
      title: 'Acceptable Use — CostKit',
      description:
        'Acceptable use policy for the CostKit platform. What you can and cannot do with CostKit tools.',
    },
    '/login': {
      title: 'Sign in — CostKit',
      description:
        'Sign in to your CostKit account to access your tools, saved work, and subscription.',
    },
    '/signup': {
      title: 'Create your account — CostKit',
      description:
        'Start your free CostKit account. Access core valuation tools instantly — no credit card required.',
    },
    '/forgot-password': {
      title: 'Reset your password — CostKit',
      description: 'Request a password reset link for your CostKit account.',
    },
    '/reset-password': {
      title: 'Set new password — CostKit',
      description: 'Set a new password for your CostKit account.',
    },
    '/account': {
      title: 'Account — CostKit',
      description: 'Manage your CostKit profile, preferences, and security settings.',
    },
    '/billing': {
      title: 'Billing — CostKit',
      description: 'Manage your CostKit subscription, billing details, and invoices.',
    },
    '*': {
      title: 'Page not found — CostKit',
      description:
        'The page you are looking for does not exist. Return to CostKit and find the tool you need.',
    },
  },
} as const

export type Site = typeof site
