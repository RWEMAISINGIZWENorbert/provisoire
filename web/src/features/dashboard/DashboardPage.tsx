import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTopics } from '@/lib/hooks/useContent'
import { localized } from '@/lib/localized'
import { xpProgress } from '@/lib/xp'
import { useAppSelector } from '@/store/hooks'

function timeOfDayKey(hour: number): 'morning' | 'afternoon' | 'evening' {
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { xp, streak, topicProgress } = useAppSelector((s) => s.progress)
  const { data: topics = [] } = useTopics()
  const lang = i18n.language

  const sortedTopics = [...topics].sort((a, b) => a.order - b.order)
  const progressList = Object.values(topicProgress)

  const completedCount = progressList.filter((p) => p.completed).length
  const attempted = progressList.filter((p) => p.attempts > 0)
  const bestScore = attempted.length
    ? Math.max(...attempted.map((p) => p.bestScore))
    : null

  // First incomplete topic by order = "continue learning" target
  const nextTopic =
    sortedTopics.find((topic) => !topicProgress[topic.id]?.completed) ??
    sortedTopics[0]
  const nextProg = nextTopic ? topicProgress[nextTopic.id] : undefined

  const level = xpProgress(xp)

  const stats = [
    {
      label: t('dashboard.topicsCompleted'),
      value: `${completedCount}/${sortedTopics.length}`,
    },
    { label: t('dashboard.bestScore'), value: bestScore !== null ? `${bestScore}%` : '—' },
    { label: t('dashboard.totalXp'), value: `${xp}` },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {t('dashboard.greeting', {
            timeOfDay: t(`dashboard.${timeOfDayKey(new Date().getHours())}`),
            name: user?.name ?? 'Driver',
          })}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main column ─────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Continue learning */}
          {nextTopic ? (
            <Card className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                {t('dashboard.continueLearning')}
              </p>

              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-2xl">
                  {nextTopic.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-text-primary">
                    {localized(nextTopic.title, lang)}
                  </h2>
                  <p className="mt-0.5 line-clamp-2 text-sm text-text-secondary">
                    {localized(nextTopic.summary, lang)}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <ProgressBar value={nextProg?.bestScore ?? 0} showLabel />
                <p className="text-xs text-text-secondary">
                  {nextProg && nextProg.attempts > 0
                    ? t('dashboard.attempts', { count: nextProg.attempts })
                    : t('dashboard.startFirstTopic')}
                </p>
              </div>

              <Link to={`/learn/${nextTopic.id}`}>
                <Button fullWidth>{t('dashboard.continueCta')}</Button>
              </Link>
            </Card>
          ) : (
            <Card className="py-10 text-center text-sm text-text-secondary">
              {t('common.loading')}
            </Card>
          )}

          {/* Quick actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="flex flex-col gap-3">
              <h3 className="font-bold text-text-primary">{t('dashboard.learnTitle')}</h3>
              <p className="text-sm text-text-secondary">{t('dashboard.learnDesc')}</p>
              <Link to="/learn" className="mt-auto">
                <Button variant="secondary" fullWidth>
                  {t('nav.learn')}
                </Button>
              </Link>
            </Card>

            <Card className="flex flex-col gap-3">
              <h3 className="font-bold text-text-primary">{t('dashboard.practiceTitle')}</h3>
              <p className="text-sm text-text-secondary">{t('dashboard.practiceDesc')}</p>
              <Link to="/practice" className="mt-auto">
                <Button variant="secondary" fullWidth>
                  {t('nav.practice')}
                </Button>
              </Link>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="px-4 py-3 text-center">
                <p className="text-xl font-extrabold text-text-primary">{s.value}</p>
                <p className="mt-0.5 text-xs font-medium text-text-secondary">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Side column: level card ─────────────────────── */}
        <Card className="h-fit space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                {t('profile.level')}
              </p>
              <p className="text-lg font-extrabold text-text-primary">
                Lv {level.levelIndex + 1} · {level.levelName}
              </p>
            </div>
            <Chip variant="warning" icon="🔥">
              {streak}
            </Chip>
          </div>

          <ProgressBar value={level.percent} showLabel />
          <p className="text-xs text-text-secondary">
            {level.nextLevelName
              ? t('dashboard.xpToNext', {
                  xp: level.levelSpan - level.levelXp,
                  level: level.nextLevelName,
                })
              : t('dashboard.maxLevel')}
          </p>
        </Card>
      </div>
    </div>
  )
}