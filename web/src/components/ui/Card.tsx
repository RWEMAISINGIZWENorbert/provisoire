import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner padding preset */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Adds hover lift + pointer cursor for clickable cards */
  hoverable?: boolean
}

const paddings: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ padding = 'md', hoverable = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface-raised shadow-card',
        paddings[padding],
        hoverable && 'cursor-pointer transition-shadow duration-200 hover:shadow-pop',
        className,
      )}
      {...props}
    />
  )
}