import { createSlice } from '@reduxjs/toolkit'

import { mockProgress } from '@/lib/mock'
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

interface ProgressState {
  xp: number
  streak: number
  lastActiveDate: string | null
  topicsCompleted: number
  topicProgress: Record<string, TopicProgress>
  practiceHistory: PracticeRecord[]
}

const initialState: ProgressState = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  topicsCompleted: mockProgress.filter((p) => p.completed).length,
  topicProgress: Object.fromEntries(mockProgress.map((p) => [p.topicId, p])),
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
    /** Record a finished learn-quiz: updates best score, attempts, completion. */
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
    /** Prepend a finished practice session (keeps last 20). */
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
  recordLearnQuiz,
  recordPractice,
} = progressSlice.actions
export default progressSlice.reducer