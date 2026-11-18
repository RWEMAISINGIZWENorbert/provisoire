import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl ' +
  'transition-all duration-150 select-none cursor-pointer ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-text-inverse hover:bg-accent-hover shadow-card',
  secondary:
    'bg-surface-raised text-text-primary border border-border ' +
    'hover:border-border-strong hover:bg-surface-sunken',
  ghost: 'text-accent hover:bg-accent-soft',
  danger: 'bg-error text-text-inverse hover:opacity-90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-13 px-7 text-lg',
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth = false, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
})