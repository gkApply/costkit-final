import { useState } from 'react'
import { Link } from 'react-router-dom'

const COOKIE_CONSENT_KEY = 'cookie_consent'
type CookieConsentChoice = 'essential' | 'all'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => {
    const existingChoice = localStorage.getItem(COOKIE_CONSENT_KEY)
    return existingChoice !== 'essential' && existingChoice !== 'all'
  })

  const handleChoice = (choice: CookieConsentChoice) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice)
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-neutral-300 bg-white p-4 shadow-lg sm:p-5">
        <p className="text-sm leading-6 text-neutral-700">
          We use cookies to improve site performance and understand usage patterns. See our{' '}
          <Link
            to="/privacy"
            className="font-semibold text-brand-600 underline hover:text-brand-700"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => handleChoice('essential')}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => handleChoice('all')}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
