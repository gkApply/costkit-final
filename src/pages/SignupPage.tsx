import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '@/hooks/usePageMeta'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  usePageMeta({
    title: 'Create account — CostKit',
    description: 'Create your free CostKit account',
  })

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setSubmitting(false)
      return
    }

    setConfirmationSent(true)
    setSubmitting(false)
  }

  const handleGoogleSignUp = async () => {
    setError(null)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })

    if (oauthError) {
      setError('Google sign-up could not be started. Please try again.')
    }
  }

  if (confirmationSent) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Check your email</h1>
        <p className="text-base text-neutral-700">
          We sent a confirmation link to your inbox. Open it to finish creating your account.
        </p>
        <p className="text-base text-neutral-700">
          Already verified?{' '}
          <Link
            to="/login"
            className="text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:text-brand-800"
          >
            Sign in
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Create your account</h1>
        <p className="text-base text-neutral-700">Start with a free CostKit account.</p>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
          <label htmlFor="full-name" className="block text-base font-medium text-neutral-900">
            Full name
          </label>
          <input
            id="full-name"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-base text-neutral-900 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

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
            autoComplete="new-password"
            minLength={8}
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
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-base text-neutral-700">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-brand-600 transition-colors hover:text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:text-brand-800"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
