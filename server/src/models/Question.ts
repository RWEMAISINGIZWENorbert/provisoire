import mongoose, { type Document, type Model, Schema } from 'mongoose'

import { localizedSchema, type LocalizedText } from './localized'

export interface IQuestion extends Document {
  id: string
  topicId: string // matches Topic.slug / Topic.id
  text: LocalizedText
  options: LocalizedText[]
  correctIndex: number
  explanation: LocalizedText
}

const questionSchema = new Schema<IQuestion>(
  {
    id: { type: String, required: true, unique: true, index: true },
    topicId: { type: String, required: true, index: true },
    text: localizedSchema,
    options: { type: [localizedSchema], required: true, validate: (v: unknown[]) => v.length === 4 },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: localizedSchema,
  },
  { timestamps: true },
)

export const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema)