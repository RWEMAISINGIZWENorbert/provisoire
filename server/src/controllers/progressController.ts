import crypto from 'crypto'
import type { Request, Response } from 'express'
import { z } from 'zod'

import { Question } from '../models/Question'
import { Topic } from '../models/Topic'
import {
  getOrCreateProgress,
  LEARN_PASS_PERCENT,
  PRACTICE_HISTORY_LIMIT,
  PRACTICE_PASS_PERCENT,
  serializeProgress,
  touchStreak,
  XP_EVENTS,
} from '../services/progress'
import type { IPracticeRecord } from '../models/Progress'

const answerSchema = z.object({
  questionId: z.string().min(1),
  // Client never sends correctness — only what the user picked
  selectedIndex: z.number().int().min(0).max(3),
})

const submitSchema = z.object({
  topicId: z.string().min(1), // topic id, or 'all' for practice
  answers: z.array(answerSchema).min(1),
})

interface ScoredResult {
  total: number
  correct: number
  scorePercent: number
}

/** Server-side scoring — looks up correctIndex, ignores any client claims. */
async function scoreAnswers(
  answers: { questionId: string; selectedIndex: number }[],
): Promise<ScoredResult> {
  const ids = [...new Set(answers.map((a) => a.questionId))]
  const questions = await Question.find({ id: { $in: ids } }).lean()
  const byId = new Map(questions.map((q) => [q.id, q]))

  let correct = 0
  for (const a of answers) {
    const q = byId.get(a.questionId)
    if (q && a.selectedIndex === q.correctIndex) correct += 1
  }
  const total = answers.length
  return {
    total,
    correct,
    scorePercent: total === 0 ? 0 : Math.round((correct / total) * 100),
  }
}

function requireUserId(req: Request, res: Response): string | null {
  if (!req.userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return null
  }
  return req.userId
}

export async function getProgress(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req, res)
  if (!userId) return
  const progress = await getOrCreateProgress(userId)
  res.json(serializeProgress(progress))
}

export async function submitLearnQuiz(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req, res)
  if (!userId) return

  const parsed = submitSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', issues: parsed.error.issues })
    return
  }
  const { topicId, answers } = parsed.data

  const topic = await Topic.findOne({
    $or: [{ id: topicId }, { slug: topicId }],
  }).lean()
  if (!topic) {
    res.status(404).json({ message: 'Topic not found' })
    return
  }

  const progress = await getOrCreateProgress(userId)
  const result = await scoreAnswers(answers)

  const xpEarned = result.correct * XP_EVENTS.learnCorrect + XP_EVENTS.learnQuizComplete
  progress.xp += xpEarned
  touchStreak(progress)

  const prev = progress.topicProgress.get(topicId)
  const bestScore = Math.max(prev?.bestScore ?? 0, result.scorePercent)
  progress.topicProgress.set(topicId, {
    topicId,
    bestScore,
    attempts: (prev?.attempts ?? 0) + 1,
    completed: bestScore >= LEARN_PASS_PERCENT,
    lastStudiedAt: new Date().toISOString(),
  })

  await progress.save()
  res.json({ result, xpEarned, progress: serializeProgress(progress) })
}

export async function submitPractice(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req, res)
  if (!userId) return

  const parsed = submitSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', issues: parsed.error.issues })
    return
  }
  const { topicId, answers } = parsed.data

  const progress = await getOrCreateProgress(userId)
  const result = await scoreAnswers(answers)
  const passed = result.scorePercent >= PRACTICE_PASS_PERCENT

  const xpEarned =
    result.correct * XP_EVENTS.practiceCorrect +
    XP_EVENTS.practiceComplete +
    (passed ? XP_EVENTS.practicePassBonus : 0)
  progress.xp += xpEarned
  touchStreak(progress)

  const record: IPracticeRecord = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    correct: result.correct,
    total: result.total,
    scorePercent: result.scorePercent,
    passed,
    topicId,
  }
  progress.practiceHistory = [record, ...progress.practiceHistory].slice(
    0,
    PRACTICE_HISTORY_LIMIT,
  )

  await progress.save()
  res.json({ result, xpEarned, progress: serializeProgress(progress) })
}