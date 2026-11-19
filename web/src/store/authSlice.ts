import { createSlice } from '@reduxjs/toolkit'

export interface AuthUser {
  id: string
  name: string
  email: string
  memberSince?: string | null // ISO, only present from GET /auth/me
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: 'idle' | 'authenticated' | 'unauthenticated'
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: { payload: { user: AuthUser; token: string } }) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'authenticated'
    },
    setUnauthenticated(state) {
      state.user = null
      state.token = null
      state.status = 'unauthenticated'
    },
  },
})

export const { setCredentials, setUnauthenticated } = authSlice.actions
export default authSlice.reducer
