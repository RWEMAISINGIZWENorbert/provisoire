import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/cn'

function GridIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/dashboard', labelKey: 'nav.dashboard', Icon: GridIcon },
  { to: '/learn', labelKey: 'nav.learn', Icon: BookIcon },
  { to: '/practice', labelKey: 'nav.practice', Icon: TargetIcon },
] as const

export function Sidebar({ hideBrand = false }: { hideBrand?: boolean }) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      {!hideBrand && (
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-lg font-extrabold text-text-inverse">
            P
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            {t('app.name')}
          </span>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, labelKey, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-surface-sunken hover:text-text-primary',
              )
            }
          >
            <Icon />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}