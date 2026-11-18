import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { useSound } from '@/lib/hooks/useSound'
import { useAuth } from '@/lib/hooks/useAuth'
import { xpProgress } from '@/lib/xp'
import { toggleSidebar } from '@/store/uiSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const LANGUAGES = [
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
] as const

export function TopBar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const sound = useSound()
  const { user, isAuthenticated, logout } = useAuth()
  const { xp, streak } = useAppSelector((s) => s.progress)
  const [menuOpen, setMenuOpen] = useState(false)

  const level = xpProgress(xp)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-surface/80 px-4 backdrop-blur sm:gap-3 sm:px-6">
      {/* Hamburger — mobile only */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Open menu"
        className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary lg:hidden"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      {/* Streak */}
      <Chip variant="warning" icon="🔥" className="hidden sm:inline-flex">
        {streak}
      </Chip>

      {/* XP / level */}
      <Link to="/profile" aria-label="Profile">
        <Chip variant="accent" className="hidden md:inline-flex">
          Lv {level.levelIndex + 1} · {xp} XP
        </Chip>
      </Link>

      {/* Sound toggle */}
      <button
        onClick={sound.toggle}
        aria-label={sound.enabled ? 'Mute sounds' : 'Unmute sounds'}
        className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
      >
        <span className="text-lg">{sound.enabled ? '🔊' : '🔇'}</span>
      </button>

      {/* Language */}
      <select
        value={i18n.language}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        aria-label={t('menu.language')}
        className="h-9 rounded-xl border border-border bg-surface-raised px-2 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>

      {/* Avatar + menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Account menu"
          className="rounded-full transition-transform hover:scale-105"
        >
          <Avatar name={user?.name ?? 'Guest'} size="sm" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border border-border bg-surface-raised p-1.5 shadow-pop">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-sunken"
                  >
                    {t('menu.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                      navigate('/')
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-error transition-colors hover:bg-error/10"
                  >
                    {t('menu.logout')}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    navigate('/login')
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
                >
                  {t('menu.signIn')}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}