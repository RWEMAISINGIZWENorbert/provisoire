import { createSlice } from '@reduxjs/toolkit'

import type { TopicProgress } from '@/lib/mock'

export interface PracticeRecord {
  id: string
  date: string // ISO
  correct: number
  total: number
  scorePercent: number
  passed: boolean
  topicId: string // 'all' or a topic id
}

/** Shape returned by GET /api/v1/progress and the submit endpoints. */
export interface ProgressSnapshot {
  xp: number
  streak: number
  lastActiveDate: string | null
  topicsCompleted: number
  topicProgress: Record<string, TopicProgress>
  practiceHistory: PracticeRecord[]
}

interface ProgressState extends ProgressSnapshot {}

const initialState: ProgressState = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  topicsCompleted: 0,
  topicProgress: {},
  practiceHistory: [],
}

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addXp(state, action: { payload: number }) {
      state.xp += action.payload
    },
    setStreak(state, action: { payload: number }) {
      state.streak = action.payload
    },
    markActiveToday(state, action: { payload: string }) {
      state.lastActiveDate = action.payload
    },
    setTopicsCompleted(state, action: { payload: number }) {
      state.topicsCompleted = action.payload
    },
    /** Hydrate/replace progress with the server-authoritative snapshot. */
    syncProgress(state, action: { payload: ProgressSnapshot }) {
      const p = action.payload
      state.xp = p.xp
      state.streak = p.streak
      state.lastActiveDate = p.lastActiveDate
      state.topicProgress = p.topicProgress ?? {}
      state.practiceHistory = p.practiceHistory ?? []
      state.topicsCompleted = Object.values(state.topicProgress).filter(
        (tp) => tp.completed,
      ).length
    },
    /** Wipe progress on logout so the next user starts clean. */
    resetProgress() {
      return {
        ...initialState,
        topicProgress: {},
        practiceHistory: [],
      }
    },
    /** Offline/dev fallback only — server responses use syncProgress instead. */
    recordLearnQuiz(
      state,
      action: { payload: { topicId: string; scorePercent: number } },
    ) {
      const { topicId, scorePercent } = action.payload
      const prev = state.topicProgress[topicId] ?? {
        topicId,
        bestScore: 0,
        attempts: 0,
        completed: false,
        lastStudiedAt: null,
      }
      const next: TopicProgress = {
        ...prev,
        attempts: prev.attempts + 1,
        bestScore: Math.max(prev.bestScore, scorePercent),
        lastStudiedAt: new Date().toISOString(),
      }
      next.completed = next.bestScore >= 80
      state.topicProgress[topicId] = next
      state.topicsCompleted = Object.values(state.topicProgress).filter(
        (p) => p.completed,
      ).length
    },
    /** Offline/dev fallback only — server responses use syncProgress instead. */
    recordPractice(
      state,
      action: { payload: Omit<PracticeRecord, 'id' | 'date'> },
    ) {
      state.practiceHistory.unshift({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        ...action.payload,
      })
      if (state.practiceHistory.length > 20) state.practiceHistory.length = 20
    },
  },
})

export const {
  addXp,
  setStreak,
  markActiveToday,
  setTopicsCompleted,
  syncProgress,
  resetProgress,
  recordLearnQuiz,
  recordPractice,
} = progressSlice.actions
export default progressSlice.reducer