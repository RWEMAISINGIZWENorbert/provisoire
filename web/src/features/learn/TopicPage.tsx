import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Confetti } from '@/components/ui/Confetti'
import { QuizPlayer, type QuizResult } from '@/components/quiz/QuizPlayer'
import { useTopics, useTopic } from '@/lib/hooks/useContent'
import { useSound } from '@/lib/hooks/useSound'
import { useReward } from '@/lib/hooks/useReward'
import { localized } from '@/lib/localized'
import { XP_EVENTS } from '@/lib/xp'
import { recordLearnQuiz } from '@/store/progressSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

type View = 'read' | 'quiz' | 'result'

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const sound = useSound()
  const { award } = useReward()
  const lang = i18n.language

  const topicQuery = useTopic(topicId)
  const { data: allTopics = [] } = useTopics()
  const topic = topicQuery.data?.topic
  const questions = topicQuery.data?.questions ?? []
  const progress = useAppSelector(
    (s) => s.progress.topicProgress[topic?.id ?? ''],
  )

  const [view, setView] = useState<View>('read')
  const [quizRun, setQuizRun] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  if (topicQuery.isLoading) {
    return (
      <div className="py-20 text-center text-sm text-text-secondary">
        {t('common.loading')}
      </div>
    )
  }
  if (topicQuery.isError || !topic) return <Navigate to="/learn" replace />

  const sorted = [...allTopics].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex((tp) => tp.id === topic.id)
  const nextTopic = sorted[idx + 1]

  function handleFinish(res: QuizResult) {
    const xp = res.correct * XP_EVENTS.learnCorrect + XP_EVENTS.learnQuizComplete
    setXpEarned(xp)
    setResult(res)
    setView('result')
    award(xp)
    dispatch(
      recordLearnQuiz({ topicId: topic?.id || '', scorePercent: res.scorePercent }),
    )
    if (res.scorePercent >= 80) sound.play('success')
  }

  // ── Quiz ──────────────────────────────────────────────────
  if (view === 'quiz') {
    return (
      <QuizPlayer
        key={quizRun}
        questions={questions}
        onFinish={handleFinish}
        onExit={() => setView('read')}
      />
    )
  }

  // ── Result ────────────────────────────────────────────────
  if (view === 'result' && result) {
    const passed = result.scorePercent >= 80
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {passed && <Confetti />}
        <Card className="space-y-5 text-center">
          <Chip variant={passed ? 'success' : 'warning'}>
            {passed ? t('practice.pass') : t('practice.fail')}
          </Chip>
          <div>
            <p className="text-4xl font-extrabold text-text-primary">
              {result.correct}/{result.total}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {result.scorePercent}% · {t('learn.xpEarned', { xp: xpEarned })}
            </p>
          </div>
          {!passed && (
            <p className="text-sm text-text-secondary">{t('learn.keepPracticing')}</p>
          )}
          {passed && (
            <p className="text-sm font-semibold text-success">{t('learn.topicCompleted')}</p>
          )}
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button
              variant="secondary"
              onClick={() => {
                setQuizRun((r) => r + 1)
                setView('quiz')
              }}
            >
              {t('learn.retakeQuiz')}
            </Button>
            {nextTopic && (
              <Link to={`/learn/${nextTopic.id}`}>
                <Button>{t('learn.nextTopic')}</Button>
              </Link>
            )}
            <Link to="/learn">
              <Button variant="ghost">{t('learn.backToTopics')}</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // ── Read ──────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/learn"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition-colors hover:text-accent"
      >
        ← {t('learn.backToTopics')}
      </Link>

      <Card className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/10 text-3xl">
            {topic.icon}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text-primary">
              {localized(topic.title, lang)}
            </h1>
            <p className="mt-1 text-text-secondary">
              {localized(topic.summary, lang)}
            </p>
            {progress && (
              <Chip
                className="mt-3"
                variant={progress.completed ? 'success' : 'neutral'}
              >
                {progress.bestScore}% best
              </Chip>
            )}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {topic.sections.map((section, i) => (
          <Card key={i}>
            <h2 className="font-bold text-text-primary">
              {localized(section.heading, lang)}
            </h2>
            <p className="mt-2 leading-relaxed text-text-secondary">
              {localized(section.body, lang)}
            </p>
          </Card>
        ))}
      </div>

      <Card className="space-y-4 text-center">
        <p className="font-semibold text-text-primary">{t('learn.quizReady')}</p>
        <Button
          size="lg"
          disabled={questions.length === 0}
          onClick={() => setView('quiz')}
        >
          {t('learn.startQuiz')}
        </Button>
      </Card>
    </div>
  )
}