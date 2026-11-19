// import mongoose from 'mongoose'

// export async function connectDb(): Promise<void> {
//   const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/provisoire'
//   await mongoose.connect(uri)
//   console.log(`MongoDB connected → ${mongoose.connection.name}`)
// }

////// DEPLOYED CODES ////////
import mongoose from 'mongoose'

// Reuse the connection across warm lambda invocations
const globalForMongoose = globalThis as unknown as {
  _mongooseConn?: Promise<typeof mongoose>
}

export function connectDb(): Promise<typeof mongoose> {
  const uri =
    process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/provisoire'
  globalForMongoose._mongooseConn ??= mongoose
    .connect(uri)
    .then((m) => {
      console.log(`MongoDB connected → ${m.connection.name}`)
      return m
    })
    .catch((err) => {
      globalForMongoose._mongooseConn = undefined // allow retry on cold start
      throw err
    })
  return globalForMongoose._mongooseConn
}