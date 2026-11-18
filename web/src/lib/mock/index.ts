import { MOCK_QUESTIONS, MOCK_TOPICS } from './content'
import type { MockUser, TopicProgress } from './types'
 
export const mockUser: MockUser = {
  id: 'u1',
  name: 'Demo Learner',
  email: 'demo@provisoire.rw',
  xp: 145,
  streak: 4,
  lastActiveDate: null,
}
 
export const mockProgress: TopicProgress[] = MOCK_TOPICS.map((topic, i) => ({
  topicId: topic.id,
  bestScore: [100, 80, 40, 0, 60, 0][i] ?? 0,
  attempts: [2, 1, 1, 0, 1, 0][i] ?? 0,
  completed: [true, true, false, false, false, false][i] ?? false,
  lastStudiedAt: [true, true, true, false, true, false][i] ? new Date().toISOString() : null,
}))
 
export { MOCK_QUESTIONS, MOCK_TOPICS }
export type { MockUser, Question, Topic, TopicProgress, LocalizedText } from './types'