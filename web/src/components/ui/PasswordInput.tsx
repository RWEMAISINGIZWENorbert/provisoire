import { useState, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'
import { inputClasses, type TextInputProps } from './TextInput'

export function PasswordInput({ className, ...props }: Omit<TextInputProps, 'type'>) {
  const [show, setShow] = useState(false)
  // label/hint/error handled same as TextInput — reuse its wrapper via composition:
  const { label, hint, error, id, ...inputProps } = props as TextInputProps & InputHTMLAttributes<HTMLInputElement>

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          aria-invalid={!!error}
          className={cn(inputClasses, 'pr-11', className)}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-secondary transition-colors hover:text-text-primary"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-error">{error}</p>
      ) : hint ? (
        <p className="text-sm text-text-secondary">{hint}</p>
      ) : null}
    </div>
  )
}

function EyeIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  )
}