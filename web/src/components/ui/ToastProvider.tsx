import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Snackbar, type SnackbarVariant } from './Snackbar'

interface ToastItem {
  id: number
  variant: SnackbarVariant
  title: string
  description?: string
  duration: number
}

export interface ToastOptions {
  description?: string
  /** ms until auto-dismiss. 0 = sticky until closed. Default 4000. */
  duration?: number
}

interface ToastApi {
  success: (title: string, opts?: ToastOptions) => void
  error: (title: string, opts?: ToastOptions) => void
  info: (title: string, opts?: ToastOptions) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (variant: SnackbarVariant, title: string, opts?: ToastOptions) => {
      const id = ++nextId.current
      const duration = opts?.duration ?? (variant === 'error' ? 6000 : 4000)
      setToasts((t) => [...t.slice(-2), { id, variant, title, description: opts?.description, duration }])
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (title, opts) => push('success', title, opts),
      error: (title, opts) => push('error', title, opts),
      info: (title, opts) => push('info', title, opts),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Snackbar stack — bottom center on mobile, bottom-right on desktop */}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <Snackbar
                variant={t.variant}
                title={t.title}
                description={t.description}
                onClose={() => dismiss(t.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}