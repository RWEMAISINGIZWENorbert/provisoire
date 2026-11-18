import { useCallback } from 'react'

import { setCredentials, setUnauthenticated, type AuthUser } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function nameFromEmail(email: string): string {
  const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return base ? base[0].toUpperCase() + base.slice(1) : 'Driver'
}

/** Auth state + mock login/logout. Real JWT wiring comes with the backend. */
export function useAuth() {
  const { user, status } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()

  const login = useCallback(
    (u: AuthUser, token: string) => dispatch(setCredentials({ user: u, token })),
    [dispatch],
  )

  const logout = useCallback(() => dispatch(setUnauthenticated()), [dispatch])

  /** Mock sign-in for development — replaced by API call in Phase 5. */
  const mockLogin = useCallback(() => {
    login({ id: 'u1', name: 'Demo Learner', email: 'demo@provisoire.rw' }, 'mock-token')
  }, [login])

  /** Mock credential sign-in — swap body for apiFetch('/auth/login') later. */
  const signIn = useCallback(
    async (email: string) => {
      await delay(700)
      login({ id: 'u1', name: nameFromEmail(email), email }, `mock-token-${email}`)
    },
    [login],
  )

  /** Mock registration — swap body for apiFetch('/auth/register') later. */
  const signUp = useCallback(
    async (name: string, email: string) => {
      await delay(800)
      login({ id: 'u1', name, email }, `mock-token-${email}`)
    },
    [login],
  )

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    login,
    logout,
    mockLogin,
    signIn,
    signUp,
  }
}