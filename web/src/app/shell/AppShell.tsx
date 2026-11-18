import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Drawer } from '@/components/ui/Drawer'
import { setSidebarOpen } from '@/store/uiSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppShell() {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen)
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    dispatch(setSidebarOpen(false))
  }, [pathname, dispatch])

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Desktop sidebar — persistent on lg+ */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface-raised lg:flex">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <Drawer
        open={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        title="Provisoire"
        width="w-72"
      >
        <Sidebar hideBrand />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <TopBar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}