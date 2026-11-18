import type { Request, Response } from 'express'

import { Question } from '../models/Question'
import { Topic } from '../models/Topic'

/** Strip Mongoose internals; `id` is our own string field. */
function serializeTopic(t: Record<string, unknown>) {
  const { _id, __v, createdAt, updatedAt, ...rest } = t
  return rest
}

export async function listTopics(_req: Request, res: Response): Promise<void> {
  const topics = await Topic.find().sort({ order: 1 }).lean()
  res.json(topics.map(serializeTopic))
}

export async function getTopic(req: Request, res: Response): Promise<void> {
  const topic = await Topic.findOne({ slug: req.params.slug }).lean()
  if (!topic) {
    res.status(404).json({ message: 'Topic not found' })
    return
  }
  const questions = await Question.find({ topicId: topic.slug }).lean()
  res.json({
    topic: serializeTopic(topic as Record<string, unknown>),
    questions: questions.map((q) => {
      const { _id, __v, createdAt, updatedAt, ...rest } = q as Record<string, unknown>
      return rest
    }),
  })
}

export async function listQuestions(_req: Request, res: Response): Promise<void> {
  const questions = await Question.find().lean()
  res.json(
    questions.map((q) => {
      const { _id, __v, createdAt, updatedAt, ...rest } = q as Record<string, unknown>
      return rest
    }),
  )
}