import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes from './routes/authRoutes'
import contentRoutes from './routes/contentRoutes'
import progressRoutes from './routes/progressRoutes'
import { assertEnv } from './config/env'
import { sanitizeInput } from './middleware/sanitize'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()
assertEnv()

export const app = express()
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173'

// Comma-separated allowlist; falls back to the single dev origin
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? CLIENT_URL)
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

// ── Security middleware ─────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = curl / server-to-server / same-origin nav — allow
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true, // required for the httpOnly refresh cookie
  }),
)
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.use(sanitizeInput)

// Trust the first proxy hop (Vercel) so req.ip = real client IP for rate limits
app.set('trust proxy', 1)

// Global rate limit — tighter limits live on auth + progress routes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

// ── Routes ──────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'provisoire-api',
    mongo: mongoose.connection.readyState === 1 ? 'up' : 'down',
  })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/content', contentRoutes)
app.use('/api/v1/progress', progressRoutes)

// ── 404 + error handler ─────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})
app.use(errorHandler)

export default app