import { store } from '@/store'
import { setCredentials, setUnauthenticated, type AuthUser } from '@/store/authSlice'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Attach the auth token (default true) */
  auth?: boolean
}

interface TokenResponse {
  user: AuthUser
  accessToken: string
}

let refreshPromise: Promise<string | null> | null = null

/** Single-flight refresh — concurrent 401s share one refresh call. */
function tryRefresh(): Promise<string | null> {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        store.dispatch(setUnauthenticated())
        return null
      }
      const data = (await res.json()) as TokenResponse
      store.dispatch(setCredentials({ user: data.user, token: data.accessToken }))
      return data.accessToken
    } catch {
      store.dispatch(setUnauthenticated())
      return null
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options

  const doFetch = (token: string | null) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (auth && token) headers.Authorization = `Bearer ${token}`
    return fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  let res = await doFetch(auth ? store.getState().auth.token : null)

  // Access token expired → refresh once, retry once, else force logout
  if (res.status === 401 && auth) {
    const newToken = await tryRefresh()
    if (!newToken) throw new ApiError(401, 'Session expired')
    res = await doFetch(newToken)
  }

  if (res.status === 204) return undefined as T

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(res.status, (data as { message?: string })?.message ?? res.statusText)
  }
  return data as T
}