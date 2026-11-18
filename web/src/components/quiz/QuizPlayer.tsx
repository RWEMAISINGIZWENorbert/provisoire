import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'
import { QuizOption } from '@/components/ui/QuizOption'
import { useToast } from '@/components/ui/ToastProvider'
import { useSound } from '@/lib/hooks/useSound'
import { localized } from '@/lib/localized'
import type { Question } from '@/lib/mock'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export interface QuizAnswer {
  questionId: string
  selectedIndex: number
  correct: boolean
}

export interface QuizResult {
  total: number
  correct: number
  scorePercent: number
  answers: QuizAnswer[]
}

interface QuizPlayerProps {
  questions: Question[]
  onFinish: (result: QuizResult) => void
  onExit: () => void
}

export function QuizPlayer({ questions, onFinish, onExit }: QuizPlayerProps) {
  const { t, i18n } = useTranslation()
  const toast = useToast()
  const sound = useSound()
  const lang = i18n.language

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])

  const question = questions[index]
  const answered = selected !== null
  const isLast = index === questions.length - 1

  function choose(optionIndex: number) {
    if (answered || !question) return
    setSelected(optionIndex)
    const correct = optionIndex === question.correctIndex
    sound.play(correct ? 'correct' : 'wrong')
    setAnswers((a) => [
      ...a,
      { questionId: question.id, selectedIndex: optionIndex, correct },
    ])
    if (!correct) {
      toast.error(t('common.wrong'), {
        description: `${localized(question.options[question.correctIndex], lang)} — ${localized(question.explanation, lang)}`,
      })
    }
  }

  function handleNext() {
    if (isLast) {
      const correctCount = answers.filter((a) => a.correct).length
      onFinish({
        total: questions.length,
        correct: correctCount,
        scorePercent: Math.round((correctCount / questions.length) * 100),
        answers,
      })
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
  }

  if (!question) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="text-sm font-semibold text-text-secondary transition-colors hover:text-accent"
        >
          ← {t('common.back')}
        </button>
        <p className="text-sm font-semibold text-text-secondary">
          {t('learn.questionOf', { current: index + 1, total: questions.length })}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-raised p-5 shadow-card sm:p-6">
        <p className="text-base font-semibold text-text-primary sm:text-lg">
          {localized(question.text, lang)}
        </p>
        <div className="mt-5 space-y-3">
          {question.options.map((opt, i) => {
            const state = !answered
              ? 'idle'
              : i === question.correctIndex
                ? 'correct'
                : i === selected
                  ? 'wrong'
                  : 'idle'
            return (
              <QuizOption
                key={i}
                letter={LETTERS[i]}
                state={state}
                disabled={answered}
                onClick={() => choose(i)}
              >
                {localized(opt, lang)}
              </QuizOption>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!answered}>
          {isLast ? t('common.finish') : t('common.next')}
        </Button>
      </div>
    </div>
  )
}