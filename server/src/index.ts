import express, { type NextFunction, type Request, type Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes'
import contentRoutes from './routes/contentRoutes'

import { connectDb } from './config/db'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT ?? 5000)
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173'

// ── Security middleware ─────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // required for the httpOnly refresh cookie
  }),
)
app.use(express.json())
app.use(cookieParser())

// Global rate limit — generous for now, tightened on auth routes in B2
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

// TODO B2+: app.use('/api/v1/auth', authRoutes) etc.
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/content', contentRoutes)

// ── 404 + error handler ─────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

// ── Boot ────────────────────────────────────────────────────
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })