/** XP economy — single source of truth for all point values. */
export const XP_EVENTS = {
  learnCorrect: 5,        // per correct answer in a topic quiz
  learnQuizComplete: 20,  // finishing all 5 questions of a topic quiz
  practiceCorrect: 5,     // per correct answer in practice
  practiceComplete: 50,   // finishing a 20-question practice session
  practicePassBonus: 25,  // bonus when practice score ≥ pass threshold
} as const

export interface Level {
  name: string
  minXp: number
}

export const LEVELS: Level[] = [
  { name: 'Beginner', minXp: 0 },
  { name: 'Learner', minXp: 100 },
  { name: 'Driver', minXp: 300 },
  { name: 'Expert', minXp: 700 },
  { name: 'Road Master', minXp: 1500 },
]

export interface XpProgress {
  levelIndex: number
  levelName: string
  nextLevelName: string | null
  /** XP earned within the current level */
  levelXp: number
  /** XP needed to complete the current level (0 at max level) */
  levelSpan: number
  /** 0–100 progress through current level */
  percent: number
}

export function xpProgress(totalXp: number): XpProgress {
  let levelIndex = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].minXp) levelIndex = i
  }
  const current = LEVELS[levelIndex]
  const next = LEVELS[levelIndex + 1] ?? null
  const levelXp = totalXp - current.minXp
  const levelSpan = next ? next.minXp - current.minXp : 0
  const percent = next ? Math.min(100, Math.round((levelXp / levelSpan) * 100)) : 100
  return {
    levelIndex,
    levelName: current.name,
    nextLevelName: next?.name ?? null,
    levelXp,
    levelSpan,
    percent,
  }
}