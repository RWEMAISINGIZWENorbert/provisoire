import mongoose from 'mongoose'

export async function connectDb(): Promise<void> {
  const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/provisoire'
  await mongoose.connect(uri)
  console.log(`MongoDB connected → ${mongoose.connection.name}`)
}