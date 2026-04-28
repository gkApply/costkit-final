import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { badgeVariants, cardVariants } from '@/components/ui/variants'
import { useAuthContext } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  usePageMeta({ title: 'Dashboard — CostKit', description: 'Your CostKit dashboard' })

  const { user, profile } = useAuthContext()

  const displayName = profile?.full_name || user?.email || 'Analyst'
  const subscriptionStatus = profile?.subscription_status || 'free'

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900">Welcome back, {displayName}</h1>
        <span
          className={cn(badgeVariants({ tier: 'free' }), 'inline-flex border border-brand-300')}
        >
          {subscriptionStatus}
        </span>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to="/workspace"
          className={cn(
            cardVariants(),
            'block border border-neutral-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98]',
          )}
        >
          <h2 className="text-xl font-semibold text-neutral-900">Open Workspace</h2>
          <p className="mt-2 text-base text-neutral-700">
            Continue working on valuation models and analysis outputs.
          </p>
        </Link>

        <Link
          to="/billing"
          className={cn(
            cardVariants(),
            'block border border-neutral-200 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98]',
          )}
        >
          <h2 className="text-xl font-semibold text-neutral-900">Manage Billing</h2>
          <p className="mt-2 text-base text-neutral-700">
            Review your plan, invoices, and subscription status.
          </p>
        </Link>
      </section>
    </main>
  )
}
