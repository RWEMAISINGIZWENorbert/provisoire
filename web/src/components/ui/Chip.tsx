import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ChipVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'error'

export interface ChipProps {
  variant?: ChipVariant
  icon?: ReactNode
  children: ReactNode
  className?: string
}

const variants: Record<ChipVariant, string> = {
  neutral: 'bg-surface-sunken text-text-secondary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
}

export function Chip({ variant = 'neutral', icon, children, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
        'text-xs font-semibold whitespace-nowrap',
        variants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}