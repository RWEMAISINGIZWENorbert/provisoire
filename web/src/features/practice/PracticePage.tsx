import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Confetti } from '@/components/ui/Confetti'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QuizPlayer, type QuizResult } from '@/components/quiz/QuizPlayer'
import { useQuestions, useTopics } from '@/lib/hooks/useContent'
import { toAnswerPayload, useSubmitPractice } from '@/lib/hooks/useProgress'
import { useSound } from '@/lib/hooks/useSound'
import { useReward } from '@/lib/hooks/useReward'
import { cn } from '@/lib/cn'
import { localized } from '@/lib/localized'
import type { Question } from '@/lib/mock'
import { XP_EVENTS } from '@/lib/xp'
import { recordPractice } from '@/store/progressSlice'
import { useAppDispatch } from '@/store/hooks'

const SESSION_SIZE = 20
const PASS_PERCENT = 80 // TODO: verify against the official exam pass mark
const WEAK_THRESHOLD = 70

type View = 'setup' | 'quiz' | 'result'
type TopicChoice = 'all' | string

/** Shuffle and take n; top up with replacement when the pool is smaller than n. */
function sampleQuestions(pool: Question[], n: number): Question[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  if (shuffled.length >= n) return shuffled.slice(0, n)
  const out = [...shuffled]
  while (out.length < n) {
    out.push(shuffled[Math.floor(Math.random() * shuffled.length)])
  }
  return out
}

interface TopicStat {
  topicId: string
  correct: number
  total: number
  pct: number
}

export default function PracticePage() {
  const { t, i18n } = useTranslation()
  const sound = useSound()
  const { award } = useReward()
  const submitPractice = useSubmitPractice()
  const lang = i18n.language

  const [view, setView] = useState<View>('setup')
  const [topicChoice, setTopicChoice] = useState<TopicChoice>('all')
  const [questions, setQuestions] = useState<Question[]>([])
  const [result, setResult] = useState<QuizResult | null>(null)
  const [xpEarned, setXpEarned] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const dispatch = useAppDispatch()

  const {
    data: allQuestions = [],
    isLoading: questionsLoading,
    isError: questionsError,
  } = useQuestions()
  const { data: topics = [] } = useTopics()
  const sortedTopics = [...topics].sort((a, b) => a.order - b.order)

  const poolSize = useMemo(
    () =>
      topicChoice === 'all'
        ? allQuestions.length
        : allQuestions.filter((q) => q.topicId === topicChoice).length,
    [topicChoice, allQuestions],
  )

  // Per-topic breakdown of the finished session, weakest first
  const breakdown = useMemo<TopicStat[]>(() => {
    if (!result) return []
    const map = new Map<string, { correct: number; total: number }>()
    for (const a of result.answers) {
      const q = allQuestions.find((x) => x.id === a.questionId)
      if (!q) continue
      const e = map.get(q.topicId) ?? { correct: 0, total: 0 }
      e.total += 1
      if (a.correct) e.correct += 1
      map.set(q.topicId, e)
    }
    return [...map.entries()]
      .map(([topicId, s]) => ({
        topicId,
        ...s,
        pct: Math.round((s.correct / s.total) * 100),
      }))
      .sort((a, b) => a.pct - b.pct)
  }, [result, allQuestions])

  const weakTopics = breakdown.filter((b) => b.pct < WEAK_THRESHOLD)

  function start() {
    const pool =
      topicChoice === 'all'
        ? allQuestions
        : allQuestions.filter((q) => q.topicId === topicChoice)
    setQuestions(sampleQuestions(pool, SESSION_SIZE))
    setView('quiz')
  }

  async function handleFinish(res: QuizResult) {
    setSubmitting(true)
    try {
      // Server scores the answers — client values are never trusted
      const data = await submitPractice.mutateAsync({
        topicId: topicChoice,
        answers: toAnswerPayload(res.answers),
      })
      setResult({ ...res, ...data.result })
      setXpEarned(data.xpEarned)
      setView('result')
      if (data.result.scorePercent >= PASS_PERCENT) sound.play('success')
    } catch {
      // API unreachable — local fallback for dev only
      const passed = res.scorePercent >= PASS_PERCENT
      const xp =
        res.correct * XP_EVENTS.practiceCorrect +
        XP_EVENTS.practiceComplete +
        (passed ? XP_EVENTS.practicePassBonus : 0)
      setXpEarned(xp)
      setResult(res)
      setView('result')
      award(xp)
      dispatch(
        recordPractice({
          correct: res.correct,
          total: res.total,
          scorePercent: res.scorePercent,
          passed,
          topicId: topicChoice,
        }),
      )
      if (passed) sound.play('success')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Quiz ──────────────────────────────────────────────────
  if (view === 'quiz') {
    if (submitting) {
      return (
        <div className="py-20 text-center text-sm text-text-secondary">
          {t('common.loading')}
        </div>
      )
    }
    return (
      <QuizPlayer
        questions={questions}
        onFinish={handleFinish}
        onExit={() => setView('setup')}
      />
    )
  }

  // ── Results ───────────────────────────────────────────────
  if (view === 'result' && result) {
    const passed = result.scorePercent >= PASS_PERCENT
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
        </Card>

        {/* Score by topic — weakest first */}
        <Card className="space-y-4">
          <h2 className="font-bold text-text-primary">{t('practice.topicBreakdown')}</h2>
          <div className="space-y-3">
            {breakdown.map((b) => {
              const topic = sortedTopics.find((tp) => tp.id === b.topicId)
              if (!topic) return null
              return (
                <div key={b.topicId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">
                      {localized(topic.title, lang)}
                    </span>
                    <span className="font-bold text-text-secondary">
                      {b.correct}/{b.total}
                    </span>
                  </div>
                  <ProgressBar value={b.pct} size="sm" />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Where to put effort */}
        <Card className="space-y-3">
          <h2 className="font-bold text-text-primary">{t('practice.focusOn')}</h2>
          {weakTopics.length === 0 ? (
            <p className="text-sm text-text-secondary">{t('practice.noWeakness')}</p>
          ) : (
            <ul className="space-y-2">
              {weakTopics.slice(0, 3).map((b) => {
                const topic = sortedTopics.find((tp) => tp.id === b.topicId)
                if (!topic) return null
                return (
                  <li key={b.topicId} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-text-primary">
                      {localized(topic.title, lang)} · {b.pct}%
                    </span>
                    <Link
                      to={`/learn/${topic.id}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      {t('practice.studyThis')}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <Button onClick={start}>{t('practice.practiceAgain')}</Button>
          <Button variant="secondary" onClick={() => setView('setup')}>
            {t('practice.backToSetup')}
          </Button>
        </div>
      </div>
    )
  }

  // ── Setup ─────────────────────────────────────────────────
  if (questionsLoading) {
    return (
      <div className="py-20 text-center text-sm text-text-secondary">
        {t('common.loading')}
      </div>
    )
  }
  if (questionsError) {
    return (
      <div className="py-20 text-center text-sm text-error">
        {t('common.loadError')}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {t('practice.title')}
        </h1>
        <p className="mt-1 text-text-secondary">{t('practice.subtitle')}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={topicChoice === 'all'}
          onClick={() => setTopicChoice('all')}
          className={cn(
            'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors',
            topicChoice === 'all'
              ? 'border-accent bg-accent-soft'
              : 'border-border bg-surface-raised hover:border-border-strong',
          )}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-xl">
            🌐
          </span>
          <span className="font-bold text-text-primary">{t('practice.allTopics')}</span>
        </button>

        {sortedTopics.map((topic) => {
          const selected = topicChoice === topic.id
          return (
            <button
              key={topic.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setTopicChoice(topic.id)}
              className={cn(
                'flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors',
                selected
                  ? 'border-accent bg-accent-soft'
                  : 'border-border bg-surface-raised hover:border-border-strong',
              )}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-lg">
                {topic.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold text-text-primary">
                  {localized(topic.title, lang)}
                </span>
                <span className="block truncate text-xs text-text-secondary">
                  {localized(topic.summary, lang)}
                </span>
              </span>
              {selected && <span className="text-accent">✓</span>}
            </button>
          )
        })}
      </div>

      <Card className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-bold text-text-primary">{t('practice.startSession')}</p>
          <p className="text-sm text-text-secondary">
            {t('practice.questionCount', { count: SESSION_SIZE })}
            {poolSize < SESSION_SIZE && ' · ' + t('practice.limitedPool')}
          </p>
        </div>
        <Button size="lg" onClick={start} disabled={poolSize === 0}>
          {t('practice.startSession')}
        </Button>
      </Card>
    </div>
  )
}