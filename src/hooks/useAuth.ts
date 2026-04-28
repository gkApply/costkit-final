import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Tables } from '@/types/database'
import { getProfile, supabase } from '@/lib/supabase'

type UseAuthResult = {
  user: User | null
  profile: Tables<'profiles'> | null
  loading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) {
        return
      }

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        try {
          const currentProfile = await getProfile(currentUser.id)
          if (mounted) {
            setProfile(currentProfile)
          }
        } catch {
          if (mounted) {
            setProfile(null)
          }
        }
      } else {
        setProfile(null)
      }

      if (mounted) {
        setLoading(false)
      }
    }

    void loadInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (!currentUser) {
        setProfile(null)
        return
      }

      void getProfile(currentUser.id)
        .then((currentProfile) => {
          if (mounted) {
            setProfile(currentProfile)
          }
        })
        .catch(() => {
          if (mounted) {
            setProfile(null)
          }
        })
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  return { user, profile, loading, signOut }
}
