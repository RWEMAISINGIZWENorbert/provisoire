import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useSound } from '@/lib/hooks/useSound'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'
import { localized } from '@/lib/localized'
// import { MOCK_TOPICS } from '@/lib/mock'
import { useTopics } from '@/lib/hooks/useContent'
import { xpProgress } from '@/lib/xp'
import { setTheme } from '@/store/uiSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const LANGUAGES = [
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
] as const

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="text-sm font-semibold text-text-primary">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const sound = useSound()
  const dispatch = useAppDispatch()
  const { xp, streak, topicProgress, practiceHistory } = useAppSelector(
    (s) => s.progress,
  )
  const theme = useAppSelector((s) => s.ui.theme)
  const lang = i18n.language

  const { data: topics = [] } = useTopics()

  const level = xpProgress(xp)
  const completedCount = Object.values(topicProgress).filter((p) => p.completed).length
  const attempted = Object.values(topicProgress).filter((p) => p.attempts > 0)
  const bestScore = attempted.length ? Math.max(...attempted.map((p) => p.bestScore)) : null

  const stats = [
    { label: t('dashboard.topicsCompleted'), value: `${completedCount}/${topics.length}` },
    { label: t('dashboard.bestScore'), value: bestScore !== null ? `${bestScore}%` : '—' },
    { label: t('dashboard.totalXp'), value: `${xp}` },
  ]

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        {t('profile.title')}
      </h1>

      {/* ── User card ─────────────────────────────────────── */}
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name ?? 'Guest'} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-bold text-text-primary">
              {user?.name ?? 'Guest'}
            </p>
            <p className="truncate text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>
        <Chip variant="warning" icon="🔥">
          {streak} {t('profile.dayStreak')}
        </Chip>
      </Card>

      {/* ── Level + stats ─────────────────────────────────── */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            {t('profile.level')}
          </p>
          <span className="text-sm font-bold text-text-primary">
            Lv {level.levelIndex + 1} · {level.levelName}
          </span>
        </div>
        <ProgressBar value={level.percent} showLabel />
        <div className="grid grid-cols-3 gap-3 pt-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-surface-sunken px-3 py-2.5 text-center">
              <p className="text-lg font-extrabold text-text-primary">{s.value}</p>
              <p className="mt-0.5 text-xs font-medium text-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Settings ──────────────────────────────────────── */}
      <Card className="space-y-1">
        <h2 className="pb-2 font-bold text-text-primary">{t('profile.settings')}</h2>

        <SettingRow label={t('profile.language')}>
          <select
            value={i18n.language}
            onChange={(e) => void i18n.changeLanguage(e.target.value)}
            className="h-9 rounded-xl border border-border bg-surface-raised px-2 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </SettingRow>

        <SettingRow label={t('profile.sound')}>
          <Button size="sm" variant="secondary" onClick={sound.toggle}>
            {sound.enabled ? t('profile.soundOn') : t('profile.soundOff')}
          </Button>
        </SettingRow>

        <SettingRow label={t('profile.theme')}>
          <div className="flex rounded-xl border border-border p-1">
            {(['light', 'dark'] as const).map((th) => (
              <button
                key={th}
                onClick={() => dispatch(setTheme(th))}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                  theme === th
                    ? 'bg-accent text-text-inverse'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                {t(`profile.${th}`)}
              </button>
            ))}
          </div>
        </SettingRow>
      </Card>

      {/* ── Practice history ───────────────────────────────── */}
      <Card className="space-y-4">
        <h2 className="font-bold text-text-primary">{t('profile.practiceHistory')}</h2>
        {practiceHistory.length === 0 ? (
          <EmptyState
            icon="📝"
            title={t('profile.noHistoryTitle')}
            description={t('profile.noHistoryDesc')}
            action={
              <Link to="/practice">
                <Button size="sm">{t('nav.practice')}</Button>
              </Link>
            }
          />
        ) : (
          <ul className="space-y-2">
            {practiceHistory.map((rec) => {
              const scope =
                rec.topicId === 'all'
                  ? t('practice.allTopics')
                  : (() => {
                      const topic = topics.find((tp) => tp.id === rec.topicId)
                      return topic ? localized(topic.title, lang) : rec.topicId
                    })()
              return (
                <li
                  key={rec.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-primary">
                      {t('profile.historyScore', {
                        correct: rec.correct,
                        total: rec.total,
                      })}{' '}
                      · {scope}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatDate(rec.date, lang)}
                    </p>
                  </div>
                  <Chip variant={rec.passed ? 'success' : 'warning'}>
                    {rec.scorePercent}%
                  </Chip>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      {/* ── Sign out ───────────────────────────────────────── */}
      <Button variant="danger" fullWidth onClick={handleLogout}>
        {t('profile.signOut')}
      </Button>
    </div>
  )
}