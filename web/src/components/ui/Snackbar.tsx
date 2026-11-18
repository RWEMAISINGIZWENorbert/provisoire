import { cn } from '@/lib/cn'

export type SnackbarVariant = 'success' | 'error' | 'info'

interface SnackbarProps {
  variant: SnackbarVariant
  title: string
  description?: string
  onClose?: () => void
}

function Icon({ variant }: { variant: SnackbarVariant }) {
  const cls = 'h-5 w-5 shrink-0'
  if (variant === 'success') {
    return (
      <svg className={cn(cls, 'text-success')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }
  if (variant === 'error') {
    return (
      <svg className={cn(cls, 'text-error')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6M9 9l6 6" />
      </svg>
    )
  }
  return (
    <svg className={cn(cls, 'text-info')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

const variantStyles: Record<SnackbarVariant, string> = {
  success: 'border-success/30 bg-success-soft',
  error: 'border-error/30 bg-error-soft',
  info: 'border-info/30 bg-info-soft',
}

export function Snackbar({ variant, title, description, onClose }: SnackbarProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-pop',
        'bg-surface-raised/95 backdrop-blur',
        variantStyles[variant],
      )}
    >
      <span className="mt-0.5">
        <Icon variant={variant} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        {description && (
          <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="rounded-md p-1 text-text-secondary transition-colors hover:bg-black/5 hover:text-text-primary"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}