import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageContainer from '@/components/layout/PageContainer'
import { pricing, type PricingPlan } from '@/config/pricing'
import { usePageMeta } from '@/hooks/usePageMeta'
import { site } from '@/config/site'

const THEME = {
  primarySoft: 'var(--color-brand-400)',
  text: 'var(--color-neutral-950)',
  textMuted: 'var(--color-neutral-600)',
  surface: 'var(--color-neutral-100)',
  surfaceAlt: 'var(--color-neutral-200)',
  card: '#ffffff',
  border: 'rgba(122, 105, 74, 0.12)',
  shadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.08)',
  primary: 'var(--color-brand-500)',
} as const

function planBadgeLabel(plan: PricingPlan): string {
  if (plan.badge) return plan.badge
  if (plan.tier === 'free') return 'Free'
  if (plan.tier === 'professional') return 'Team'
  return ''
}

function annualToggleLabel(): string {
  return `${pricing.toggle.annual} (${pricing.toggle.savingsLabel.toLowerCase()})`
}

function planPricePerMonth(billing: 'monthly' | 'annual', plan: PricingPlan): number {
  if (billing === 'monthly') return plan.monthlyPrice
  return plan.annualMonthly
}

function handlePaidCta(billing: 'monthly' | 'annual', plan: PricingPlan): void {
  console.log('Stripe checkout (Phase 7B — stub)', {
    planId: plan.tier,
    planName: plan.name,
    billing,
    stripeIds: pricing.stripeIds,
  })
}

const INITIAL_FEATURE_EXPANDED: Record<string, boolean> = (() => {
  const o: Record<string, boolean> = {}
  for (const p of pricing.plans) {
    o[p.id] = false
  }
  return o
})()

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [featureExpandedByPlan, setFeatureExpandedByPlan] = useState<Record<string, boolean>>(
    () => ({ ...INITIAL_FEATURE_EXPANDED }),
  )
  const meta = site.meta['/pricing']

  usePageMeta({ title: meta.title, description: meta.description })

  return (
    <PageContainer className="space-y-10 py-8 md:space-y-12 md:py-10 lg:py-12">
      <section className="max-w-3xl">
        <div className="mb-3 text-xs uppercase tracking-wider" style={{ color: THEME.primarySoft }}>
          Pricing
        </div>
        <h1
          className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl"
          style={{ color: THEME.text }}
        >
          Simple pricing for serious valuation work.
        </h1>
        <p
          className="mt-4 text-base sm:text-lg leading-7 sm:leading-8 max-w-3xl"
          style={{ color: THEME.textMuted }}
        >
          Pick a plan and upgrade only when you need more data, collaboration, and reporting power.
        </p>
        <div className="mt-6 inline-flex flex-wrap items-center gap-0 rounded-full border border-neutral-300 bg-white p-1">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={
              billing === 'monthly'
                ? 'cursor-pointer rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white'
                : 'cursor-pointer bg-transparent px-5 py-2 text-sm font-semibold text-neutral-600'
            }
          >
            {pricing.toggle.monthly}
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            className={
              billing === 'annual'
                ? 'cursor-pointer rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white'
                : 'cursor-pointer bg-transparent px-5 py-2 text-sm font-semibold text-neutral-600'
            }
          >
            {annualToggleLabel()}
          </button>
        </div>
      </section>

      <section className="grid gap-5 pb-24 sm:gap-6 lg:grid-cols-3">
        {pricing.plans.map((plan) => {
          const accent = plan.highlighted
          const price = planPricePerMonth(billing, plan)
          const featureLabels = plan.features.filter((f) => f.included).map((f) => f.label)
          const badge = planBadgeLabel(plan)
          const isFeatureExpanded = featureExpandedByPlan[plan.id] ?? false
          const hasFeatureOverflow = featureLabels.length > 4
          const visibleFeatures =
            isFeatureExpanded || !hasFeatureOverflow ? featureLabels : featureLabels.slice(0, 4)

          return (
            <div
              key={plan.id}
              className="rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: accent
                  ? 'linear-gradient(145deg, #0D520D 0%, #2A6B24 100%)'
                  : THEME.card,
                color: accent ? '#FFFFFF' : THEME.text,
                boxShadow: accent ? '0 22px 50px rgba(13, 82, 13, 0.18)' : THEME.shadow,
                borderColor: accent ? 'rgba(42,107,36,0.3)' : THEME.border,
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{
                    background: accent ? 'rgba(255,255,255,0.16)' : THEME.surface,
                    color: accent ? '#FFFFFF' : THEME.primary,
                  }}
                >
                  {badge}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold sm:text-2xl">{plan.name}</h2>
              <div className="mt-4 flex items-end gap-2">
                <div className="font-mono text-4xl">{`$${price}`}</div>
                <span
                  className="mb-1 text-sm"
                  style={{ color: accent ? 'rgba(255,255,255,0.78)' : THEME.textMuted }}
                >
                  /month
                </span>
              </div>
              <p
                className="mb-5 mt-4 text-base leading-6"
                style={{ color: accent ? 'rgba(255,255,255,0.82)' : THEME.textMuted }}
              >
                {plan.description}
              </p>
              <div className="mb-6 space-y-2.5">
                {visibleFeatures.map((feature, featureIndex) => (
                  <div
                    key={`${plan.id}-feature-${featureIndex}`}
                    className="flex items-center gap-2.5 text-base font-medium"
                    style={{ color: accent ? '#FFFFFF' : THEME.text }}
                  >
                    <CheckCircle2
                      size={16}
                      className="shrink-0"
                      style={{ color: accent ? '#FFFFFF' : THEME.text }}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
                {hasFeatureOverflow ? (
                  <button
                    type="button"
                    onClick={() =>
                      setFeatureExpandedByPlan((prev) => ({
                        ...prev,
                        [plan.id]: !isFeatureExpanded,
                      }))
                    }
                    className={
                      accent
                        ? 'w-full text-left text-sm font-semibold text-white/90 hover:text-white'
                        : 'w-full text-left text-sm font-semibold text-brand-600 hover:text-brand-700'
                    }
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {isFeatureExpanded ? (
                        <>
                          Show less
                          <ChevronUp className="size-4" aria-hidden />
                        </>
                      ) : (
                        <>
                          Show more
                          <ChevronDown className="size-4" aria-hidden />
                        </>
                      )}
                    </span>
                  </button>
                ) : null}
              </div>
              {plan.tier === 'free' ? (
                <Link
                  to={plan.cta.href}
                  className="block w-full cursor-pointer rounded-xl px-4 py-3 text-center text-sm font-semibold transition hover:opacity-90"
                  style={{
                    background: THEME.surfaceAlt,
                    color: THEME.text,
                  }}
                >
                  {plan.cta.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    background: accent ? '#FFFFFF' : THEME.surfaceAlt,
                    color: accent ? THEME.primary : THEME.text,
                  }}
                  onClick={() => handlePaidCta(billing, plan)}
                >
                  {plan.cta.label}
                </button>
              )}
            </div>
          )
        })}
      </section>
    </PageContainer>
  )
}
