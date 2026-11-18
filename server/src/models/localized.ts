import { Schema } from 'mongoose'

export const localizedSchema = new Schema(
  {
    en: { type: String, required: true },
    fr: { type: String, required: true },
    rw: { type: String, required: true },
  },
  { _id: false },
)

export interface LocalizedText {
  en: string
  fr: string
  rw: string
}