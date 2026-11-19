import mongoose, { type Document, type Model, Schema, Types } from 'mongoose'

export interface ITopicProgress {
  topicId: string
  bestScore: number // 0–100
  attempts: number
  completed: boolean // bestScore >= 80
  lastStudiedAt: string | null
}

export interface IPracticeRecord {
  id: string
  date: string // ISO
  correct: number
  total: number
  scorePercent: number
  passed: boolean
  topicId: string // 'all' or a topic id
}

export interface IProgress extends Document {
  userId: Types.ObjectId
  xp: number
  streak: number
  /** YYYY-MM-DD in Africa/Kigali */
  lastActiveDate: string | null
  topicProgress: Map<string, ITopicProgress>
  practiceHistory: IPracticeRecord[]
}

const topicProgressSchema = new Schema<ITopicProgress>(
  {
    topicId: { type: String, required: true },
    bestScore: { type: Number, default: 0, min: 0, max: 100 },
    attempts: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
    lastStudiedAt: { type: String, default: null },
  },
  { _id: false },
)

const practiceRecordSchema = new Schema<IPracticeRecord>(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    correct: { type: Number, required: true },
    total: { type: Number, required: true },
    scorePercent: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    topicId: { type: String, required: true },
  },
  { _id: false },
)

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    xp: { type: Number, default: 0, min: 0 },
    streak: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: String, default: null },
    topicProgress: { type: Map, of: topicProgressSchema, default: {} },
    practiceHistory: { type: [practiceRecordSchema], default: [] },
  },
  { timestamps: true },
)

export const Progress: Model<IProgress> = mongoose.model<IProgress>('Progress', progressSchema)