import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type QuizOptionState = 'idle' | 'selected' | 'correct' | 'wrong'

export interface QuizOptionProps {
  /** Letter badge shown on the left, e.g. "A" */
  letter?: string
  state?: QuizOptionState
  onClick?: () => void
  disabled?: boolean
  className?: string
  children: ReactNode
}

const stateClasses: Record<QuizOptionState, string> = {
  idle: 'border-border bg-surface-raised hover:border-accent hover:bg-accent-soft/40',
  selected: 'border-accent bg-accent-soft',
  correct: 'border-success bg-success-soft',
  wrong: 'border-error bg-error-soft animate-shake',
}

const badgeClasses: Record<QuizOptionState, string> = {
  idle: 'border-border bg-surface-sunken text-text-secondary',
  selected: 'border-accent bg-accent text-text-inverse',
  correct: 'border-success bg-success text-text-inverse',
  wrong: 'border-error bg-error text-text-inverse',
}

export function QuizOption({
  letter,
  state = 'idle',
  onClick,
  disabled = false,
  className,
  children,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left',
        'transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:cursor-default disabled:opacity-80',
        stateClasses[state],
        className,
      )}
    >
      {letter && (
        <span
          className={cn(
            'grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-bold',
            'transition-colors duration-150',
            badgeClasses[state],
          )}
        >
          {letter}
        </span>
      )}
      <span className="flex-1 text-sm font-medium text-text-primary sm:text-base">{children}</span>
    </button>
  )
}