import { useEffect, useState } from 'react'

import { cn } from '@/lib/cn'

export interface ProgressBarProps {
  /** 0–100 */
  value: number
  variant?: 'accent' | 'success'
  /** Height preset */
  size?: 'sm' | 'md'
  /** Show the percentage label inside/next to the bar */
  showLabel?: boolean
  /** Animate fill from 0 on mount (default true). Set false for instant render. */
  animated?: boolean
  className?: string
}

const sizes = { sm: 'h-1.5', md: 'h-2.5' } as const
const fills = { accent: 'bg-accent', success: 'bg-success' } as const

export function ProgressBar({
  value,
  variant = 'accent',
  size = 'md',
  showLabel = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const [display, setDisplay] = useState(animated ? 0 : clamped)

  useEffect(() => {
    // Wait one frame so the browser paints width:0 first, then transition to target.
    const id = requestAnimationFrame(() => setDisplay(clamped))
    return () => cancelAnimationFrame(id)
  }, [clamped])

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('flex-1 overflow-hidden rounded-full bg-surface-sunken', sizes[size])}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full',
            animated && 'transition-[width] duration-400 ease-out',
            fills[variant],
          )}
          style={{ width: `${display}%` }}
        />
      </div>
      {showLabel && (
        <span className="w-10 text-right text-xs font-semibold text-text-secondary">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  )
}