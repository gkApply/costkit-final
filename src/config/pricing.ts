// src/config/pricing.ts
// Pricing plans, features, and Stripe price IDs.
// Import: import { pricing } from '@/config/pricing'
// Stripe IDs are filled in during Phase 7B — leave as empty strings until then.

export const pricing = {
  toggle: {
    monthly: 'Monthly',
    annual: 'Annual',
    savingsLabel: 'Save 17%',
  },

  // Stripe price IDs — fill in during Phase 7B
  stripeIds: {
    proMonthly: '',
    proAnnual: '',
    professionalMonthly: '',
    professionalAnnual: '',
  },

  plans: [
    {
      id: 'free',
      name: 'Free',
      badge: null,
      description:
        'Core reference tools for analysts who need quick lookups without a subscription.',
      monthlyPrice: 0,
      annualPrice: 0,
      annualMonthly: 0, // price per month when billed annually
      currency: 'CAD',
      seats: 1,
      cta: {
        label: 'Create free account',
        href: '/signup',
      },
      highlighted: false,
      features: [
        { label: 'WACC Calculator (limited runs)', included: true },
        { label: 'Risk-free rate lookups (GoC + UST)', included: true },
        { label: 'Tax tables (federal + provincial)', included: true },
        { label: 'Basic NAICS / SIC code lookup', included: true },
        { label: 'Currency converter', included: true },
        { label: 'CPI and GDP growth reference', included: true },
        { label: 'Country ratings reference', included: true },
        { label: 'GICS sector reference', included: true },
        { label: 'Excel export', included: false },
        { label: 'Saved projects', included: false },
        { label: 'Full cost of capital workspace', included: false },
        { label: 'Industry benchmarks and multiples', included: false },
        { label: 'Salary benchmarks', included: false },
        { label: 'Source trail and methodology notes', included: false },
        { label: 'AI-powered report builder', included: false },
      ],
      tier: 'free' as const,
    },
    {
      id: 'pro',
      name: 'Pro Firm',
      badge: 'Most popular',
      description: 'The full analyst workspace for small and mid-sized Canadian CBV firms.',
      monthlyPrice: 79,
      annualPrice: 790,
      annualMonthly: 66, // C$790 / 12 rounded
      currency: 'CAD',
      seats: 5,
      cta: {
        label: 'Start Pro trial',
        href: '/signup?plan=pro',
      },
      highlighted: true,
      features: [
        { label: 'Everything in Free', included: true },
        { label: 'Unlimited calculator runs', included: true },
        { label: 'Full cost of capital workspace', included: true },
        { label: 'Cost of equity (CAPM + build-up)', included: true },
        { label: 'Beta unlever / relever workflow', included: true },
        { label: 'DCF calculator', included: true },
        { label: 'Terminal value comparisons', included: true },
        { label: 'Industry benchmarks and multiples', included: true },
        { label: 'Credit spreads and risk premia', included: true },
        { label: 'Salary benchmarks (by role + industry)', included: true },
        { label: 'Advanced classification tools', included: true },
        { label: 'Excel export on all tools', included: true },
        { label: 'Saved projects and outputs', included: true },
        { label: 'Source trail and methodology notes', included: true },
        { label: 'Up to 5 firm seats', included: true },
        { label: 'AI-powered report builder', included: false },
      ],
      tier: 'pro' as const,
    },
    {
      id: 'professional',
      name: 'Professional',
      badge: null,
      description: 'For firms that need AI-assisted report drafting and advanced workflow support.',
      monthlyPrice: 139,
      annualPrice: 1390,
      annualMonthly: 116, // C$1390 / 12 rounded
      currency: 'CAD',
      seats: 10,
      cta: {
        label: 'Start Professional trial',
        href: '/signup?plan=professional',
      },
      highlighted: false,
      features: [
        { label: 'Everything in Pro Firm', included: true },
        { label: 'AI-powered report builder', included: true },
        { label: 'Monte Carlo simulator', included: true },
        { label: 'Sensitivity analysis (two-way tables)', included: true },
        { label: 'Reasonable compensation analysis', included: true },
        { label: 'Executive compensation benchmarks', included: true },
        { label: 'Historical sector trend analysis', included: true },
        { label: 'Industry risk premium (build-up)', included: true },
        { label: 'Priority support', included: true },
        { label: 'Up to 10 firm seats', included: true },
        { label: 'Custom seat expansion available', included: true },
      ],
      tier: 'professional' as const,
    },
  ],

  // Used by AuthGuard and tool pages to check access level
  tierOrder: ['free', 'pro', 'professional'] as const,
} as const

export type PricingPlan = (typeof pricing.plans)[number]
export type PlanTier = (typeof pricing.tierOrder)[number]
