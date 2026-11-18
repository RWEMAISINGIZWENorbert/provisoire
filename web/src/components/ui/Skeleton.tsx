import { cn } from '@/lib/cn'

export interface SkeletonProps {
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'block'
  className?: string
}

const variants = {
  text: 'h-4 w-full rounded-md',
  title: 'h-6 w-2/3 rounded-md',
  avatar: 'h-10 w-10 rounded-full',
  card: 'h-32 w-full rounded-2xl',
  block: 'h-24 w-full rounded-xl',
} as const

export function Skeleton({ variant = 'text', className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse bg-surface-sunken', variants[variant], className)}
    />
  )
}

/** Convenience: a full card-shaped loading placeholder */
export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-surface-raised p-6 shadow-card">
      <Skeleton variant="title" className="w-1/2" />
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
  )
}