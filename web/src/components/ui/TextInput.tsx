import { useId, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export const inputClasses =
  'h-11 w-full rounded-xl border bg-surface-raised px-4 text-base text-text-primary ' +
  'placeholder:text-text-secondary/60 transition-colors duration-150 ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'aria-invalid:border-error aria-invalid:focus:ring-error/20'

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function TextInput({ label, hint, error, id, className, ...props }: TextInputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const messageId = `${inputId}-message`

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error || hint ? messageId : undefined}
        className={cn(inputClasses, className)}
        {...props}
      />
      {error ? (
        <p id={messageId} className="text-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm text-text-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  )
}