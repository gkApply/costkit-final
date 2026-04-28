import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Tables } from '@/types/database'
import { useAuth } from '@/hooks/useAuth'

type AuthContextValue = {
  user: User | null
  profile: Tables<'profiles'> | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
