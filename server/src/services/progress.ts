import {
  Progress,
  type IPracticeRecord,
  type IProgress,
  type ITopicProgress,
} from '../models/Progress'

/** XP economy — must mirror web/src/lib/xp.ts. Server is authoritative. */
export const XP_EVENTS = {
  learnCorrect: 5,
  learnQuizComplete: 20,
  practiceCorrect: 5,
  practiceComplete: 50,
  practicePassBonus: 25,
} as const

export const LEARN_PASS_PERCENT = 80
export const PRACTICE_PASS_PERCENT = 80
export const PRACTICE_HISTORY_LIMIT = 20

// ── Streak — mirrors web/src/lib/streak.ts, all days in Africa/Kigali ──
const TZ = 'Africa/Kigali'

export function todayKigali(now: Date = new Date()): string {
  // en-CA locale formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function toUtcDay(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

function fromUtcDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

function addDays(dateStr: string, n: number): string {
  return fromUtcDay(toUtcDay(dateStr) + n * 86_400_000)
}

export function nextStreak(
  lastActiveDate: string | null,
  currentStreak: number,
  today: string,
): number {
  if (lastActiveDate === today) return currentStreak
  if (lastActiveDate === addDays(today, -1)) return currentStreak + 1
  return 1
}

/** Record activity for today: extends the streak on consecutive Kigali days. */
export function touchStreak(progress: IProgress, today = todayKigali()): void {
  progress.streak = nextStreak(progress.lastActiveDate, progress.streak, today)
  progress.lastActiveDate = today
}

export async function getOrCreateProgress(userId: string): Promise<IProgress> {
  const existing = await Progress.findOne({ userId })
  if (existing) return existing
  return Progress.create({ userId })
}

export interface SerializedProgress {
  xp: number
  streak: number
  lastActiveDate: string | null
  topicsCompleted: number
  topicProgress: Record<string, ITopicProgress>
  practiceHistory: IPracticeRecord[]
}

/** Shape matches the frontend progressSlice state exactly. */
export function serializeProgress(p: IProgress): SerializedProgress {
  const topicProgress: Record<string, ITopicProgress> = {}
  for (const [key, v] of p.topicProgress.entries()) {
    topicProgress[key] = {
      topicId: v.topicId || key,
      bestScore: v.bestScore,
      attempts: v.attempts,
      completed: v.completed,
      lastStudiedAt: v.lastStudiedAt ?? null,
    }
  }
  return {
    xp: p.xp,
    streak: p.streak,
    lastActiveDate: p.lastActiveDate,
    topicsCompleted: Object.values(topicProgress).filter((v) => v.completed).length,
    topicProgress,
    practiceHistory: p.practiceHistory.map((r) => ({
      id: r.id,
      date: r.date,
      correct: r.correct,
      total: r.total,
      scorePercent: r.scorePercent,
      passed: r.passed,
      topicId: r.topicId,
    })),
  }
}