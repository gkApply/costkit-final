import { FormEvent, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  usePageMeta({ title: 'Sign in — CostKit', description: 'Sign in to your CostKit account' })

  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const resetSuccess = params.get('reset') === 'success'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Invalid email or password')
      setSubmitting(false)
      return
    }

    const nextPath = params.get('next')
    navigate(nextPath || '/dashboard', { replace: true })
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })

    if (oauthError) {
      setError('Google sign-in could not be started. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Sign in</h1>
        <p className="text-base text-neutral-700">Access your CostKit workspace.</p>
      </div>

      {resetSuccess && (
        <p className="rounded-md border border-secondary-300 bg-secondary-50 px-4 py-3 text-base text-secondary-700">
          Password reset successful. You can sign in with your new password.
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full cursor-pointer rounded-md border border-neutral-300 bg-white px-4 py-2 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-base text-neutral-600">or</span>
        </div>
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

        <div className="space-y-2">
          <label htmlFor="password" className="block text-base font-medium text-neutral-900">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          className="w-full rounded-md bg-brand-500 px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="flex items-center justify-between gap-4 text-base">
        <Link
          to="/forgot-password"
          className="text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:text-brand-800"
        >
          Forgot password?
        </Link>
        <p className="text-neutral-700">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:text-brand-800"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
