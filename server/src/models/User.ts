import mongoose, { type Document, type Model, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  /** sha256 hash of the current refresh token — enables rotation + revocation */
  refreshTokenHash: string | null,
  createdAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: true },
)

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)