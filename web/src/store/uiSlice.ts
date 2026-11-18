import { createSlice } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark'

interface UiState {
  sidebarOpen: boolean
  soundOn: boolean
  theme: Theme
}

const initialState: UiState = {
  sidebarOpen: false,
  soundOn: true,
  theme: 'light',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen(state, action: { payload: boolean }) {
      state.sidebarOpen = action.payload
    },
    toggleSound(state) {
      state.soundOn = !state.soundOn
    },
    setTheme(state, action: { payload: Theme }) {
      state.theme = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, toggleSound, setTheme } = uiSlice.actions
export default uiSlice.reducer
