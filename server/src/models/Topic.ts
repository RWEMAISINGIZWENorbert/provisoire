import mongoose, { type Document, type Model, Schema } from 'mongoose'

import { localizedSchema, type LocalizedText } from './localized'

export interface ITopicSection {
  heading: LocalizedText
  body: LocalizedText
}

export interface ITopic extends Document {
  id: string
  slug: string
  icon: string
  order: number
  title: LocalizedText
  summary: LocalizedText
  sections: ITopicSection[]
}

const sectionSchema = new Schema(
  { heading: localizedSchema, body: localizedSchema },
  { _id: false },
)

const topicSchema = new Schema<ITopic>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    order: { type: Number, required: true },
    title: localizedSchema,
    summary: localizedSchema,
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true },
)

export const Topic: Model<ITopic> = mongoose.model<ITopic>('Topic', topicSchema)