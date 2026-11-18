import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/cn'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right'
  title?: string
  children: ReactNode
  /** Width class — keep narrow for nav drawers */
  width?: string
}

export function Drawer({ open, onClose, side = 'left', title, children, width = 'w-72' }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const x = { initial: side === 'left' ? '-100%' : '100%', animate: '0%', exit: side === 'left' ? '-100%' : '100%' }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'absolute inset-y-0 flex max-w-[85vw] flex-col border-border bg-surface-raised shadow-pop',
              side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
              width,
            )}
            initial={{ x: x.initial }}
            animate={{ x: x.animate }}
            exit={{ x: x.exit }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2 className="font-bold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}