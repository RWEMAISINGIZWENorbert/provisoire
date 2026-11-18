export interface LocalizedText {
  en: string
  fr: string
  rw: string
}

export interface TopicSection {
  heading: LocalizedText
  body: LocalizedText
}

export interface Topic {
  id: string
  slug: string
  icon: string
  order: number
  title: LocalizedText
  summary: LocalizedText
  sections: TopicSection[]
}

export interface Question {
  id: string
  topicId: string
  text: LocalizedText
  options: LocalizedText[]
  correctIndex: number
  explanation: LocalizedText
}

export interface TopicProgress {
  topicId: string
  bestScore: number // 0–100
  attempts: number
  completed: boolean // bestScore >= 80
  lastStudiedAt: string | null
}

export interface MockUser {
  id: string
  name: string
  email: string
  xp: number
  streak: number
  lastActiveDate: string | null
}