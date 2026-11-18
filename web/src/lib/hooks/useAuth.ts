import { useCallback } from 'react'

import { apiFetch } from '@/lib/api'
import { setCredentials, setUnauthenticated, type AuthUser } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

interface TokenResponse {
  user: AuthUser
  accessToken: string
}

/** Auth state + real API auth. Mock helpers kept for /dev previews only. */
export function useAuth() {
  const { user, status } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()

  const login = useCallback(
    (u: AuthUser, token: string) => dispatch(setCredentials({ user: u, token })),
    [dispatch],
  )

  const logout = useCallback(() => {
    // Fire-and-forget: clears the refresh cookie server-side
    void apiFetch('/api/v1/auth/logout', { method: 'POST', auth: false }).catch(() => {})
    dispatch(setUnauthenticated())
  }, [dispatch])

  /** Dev-only instant login for /dev previews — not a real session. */
  const mockLogin = useCallback(() => {
    login({ id: 'u1', name: 'Demo Learner', email: 'demo@provisoire.rw' }, 'mock-token')
  }, [login])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<TokenResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      })
      login(data.user, data.accessToken)
    },
    [login],
  )

    const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      // Account created only — caller navigates to /login to sign in
      await apiFetch<{ user: AuthUser }>('/api/v1/auth/register', {
        method: 'POST',
        body: { name, email, password },
        auth: false,
      })
    },
    [],
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