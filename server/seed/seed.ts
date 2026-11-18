import 'dotenv/config'
import mongoose from 'mongoose'

import { connectDb } from '../src/config/db'
import { Question } from '../src/models/Question'
import { Topic } from '../src/models/Topic'
import { MOCK_QUESTIONS, MOCK_TOPICS } from '../../web/src/lib/mock/content'

async function seed() {
  await connectDb()

  await Promise.all([Topic.deleteMany({}), Question.deleteMany({})])

  await Topic.insertMany(MOCK_TOPICS)
  await Question.insertMany(MOCK_QUESTIONS)

  console.log(`Seeded ${MOCK_TOPICS.length} topics, ${MOCK_QUESTIONS.length} questions`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
//   process.exit(1)
})