import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { store } from '@/store'
import { useAppSelector } from '@/store/hooks'
import { ToastProvider } from '@/components/ui/ToastProvider'
import { router } from './router'
import '@/i18n'

const queryClient = new QueryClient()

function ThemeSync() {
  const theme = useAppSelector((s) => s.ui.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return null
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ThemeSync />
          <RouterProvider router={router} />
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  )
}