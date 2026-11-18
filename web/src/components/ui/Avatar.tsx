import { cn } from '@/lib/cn'

export interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/** Deterministic color per name — same person always gets the same color. */
const PALETTES = [
  'bg-brand-100 text-brand-800',
  'bg-success/15 text-success',
  'bg-info/15 text-info',
  'bg-warning/15 text-warning',
  'bg-error/15 text-error',
  'bg-accent/15 text-accent',
] as const

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
} as const

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function hash(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const palette = PALETTES[hash(name) % PALETTES.length]
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        'grid shrink-0 select-none place-items-center rounded-full font-bold',
        sizes[size],
        palette,
        className,
      )}
    >
      {initials(name)}
    </div>
  )
}