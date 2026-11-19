import { useEffect, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { store } from '@/store'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials, setUnauthenticated, type AuthUser } from '@/store/authSlice'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { router } from './router'
import '@/i18n'
import { queryClient } from '@/lib/queryClient'

function ThemeSync() {
  const theme = useAppSelector((s) => s.ui.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return null
}

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent" />
    </div>
  )
}

const API_URL = import.meta.env.VITE_API_URL ?? ''

/** Restores the session from the refresh cookie before any route renders. */
function AuthGate({ children }: { children: ReactNode }) {
  const status = useAppSelector((s) => s.auth.status)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status !== 'idle') return
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        })
        if (cancelled) return
        if (res.ok) {
          const data = (await res.json()) as { user: AuthUser; accessToken: string }
          dispatch(setCredentials({ user: data.user, token: data.accessToken }))
        } else {
          dispatch(setUnauthenticated())
        }
      } catch {
        if (!cancelled) dispatch(setUnauthenticated())
      }
    })()
    return () => {
      cancelled = true
    }
  }, [status, dispatch])

  if (status === 'idle') return <Splash />
  return <>{children}</>
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ThemeSync />
          <AuthGate>
            <RouterProvider router={router} />
          </AuthGate>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  )
}