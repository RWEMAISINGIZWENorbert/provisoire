import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export interface EmptyStateProps {
  /** Emoji or icon node — defaults to 🚗 */
  icon?: ReactNode
  title: string
  description?: string
  /** Optional action (usually a Button) */
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon = '🚗', title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-4 text-5xl" aria-hidden>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}