import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useAuthContext } from '@/contexts/AuthContext'

type AuthGuardProps = {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuthContext()
  const location = useLocation()
  const navigate = useNavigate()
  const next = encodeURIComponent(location.pathname)

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?next=${next}`, { replace: true })
    }
  }, [loading, navigate, next, user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" aria-busy="true">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
