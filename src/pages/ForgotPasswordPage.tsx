import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  usePageMeta({ title: 'Reset password — CostKit', description: 'Reset your CostKit password' })

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setSubmitting(false)
      return
    }

    setSent(true)
    setSubmitting(false)
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-neutral-900">Check your email</h1>
        <p className="text-base text-neutral-700">
          If an account exists for that email, a reset link is on its way.
        </p>
        <Link
          to="/login"
          className="text-base text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:text-brand-800"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Reset your password</h1>
        <p className="text-base text-neutral-700">
          Enter your email and we will send a reset link.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-base font-medium text-neutral-900">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-base text-neutral-900 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {error && (
          <p role="alert" className="text-base text-danger-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-md bg-brand-500 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Sending reset link...' : 'Send reset link'}
        </button>
      </form>

      <Link
        to="/login"
        className="text-base text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:text-brand-800"
      >
        Back to sign in
      </Link>
    </div>
  )
}
