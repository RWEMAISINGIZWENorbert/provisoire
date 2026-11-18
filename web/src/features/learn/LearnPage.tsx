import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useTopics } from '@/lib/hooks/useContent'
import { localized } from '@/lib/localized'
import { useAppSelector } from '@/store/hooks'

export default function LearnPage() {
  const { t, i18n } = useTranslation()
  const topicProgress = useAppSelector((s) => s.progress.topicProgress)
  const { data: topics = [], isLoading, isError } = useTopics()
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {t('learn.title')}
        </h1>
        <p className="mt-1 text-text-secondary">{t('learn.subtitle')}</p>
      </header>

      {isLoading && (
        <p className="py-10 text-center text-sm text-text-secondary">
          {t('common.loading')}
        </p>
      )}
      {isError && (
        <p className="py-10 text-center text-sm text-error">{t('common.loadError')}</p>
      )}

      {!isLoading && !isError && (
        <div className="space-y-5">
          {sortedTopics.map((topic) => {
            const p = topicProgress[topic.id]
            const pct = p?.bestScore ?? 0
            return (
              <Link key={topic.id} to={`/learn/${topic.id}`}>
                <Card
                  hoverable
                  padding="sm"
                  className="mb-4 flex items-center gap-4"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-xl">
                    {topic.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="truncate font-bold text-text-primary">
                        {localized(topic.title, i18n.language)}
                      </h2>
                      {p?.completed && (
                        <Chip variant="success">{t('learn.completed')}</Chip>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-text-secondary">
                      {localized(topic.summary, i18n.language)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <ProgressBar value={pct} className="flex-1" />
                      <span className="w-10 text-right text-xs font-bold text-text-secondary">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 shrink-0 text-text-secondary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}