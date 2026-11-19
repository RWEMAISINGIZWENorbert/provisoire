import bcrypt from 'bcryptjs'
import type { Request, Response } from 'express'
import { z } from 'zod'

import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../lib/tokens'
import { User } from '../models/User'

const REFRESH_COOKIE = 'refreshToken'
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60 * 1000 // 30 days

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function publicUser(user: { _id: unknown; name: string; email: string }) {
  return { id: String(user._id), name: user.name, email: user.email }
}

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    // Secure cookies need HTTPS — localhost is exempt in dev, enforce in prod
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    // Only sent to auth endpoints — tightest possible scope
    path: '/api/v1/auth',
    maxAge: REFRESH_MAX_AGE,
  })
}

function issueTokenPair(userId: string) {
  return {
    accessToken: signAccessToken(userId),
    refreshToken: signRefreshToken(userId),
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', issues: parsed.error.issues })
    return
  }
  const { name, email, password } = parsed.data

  const existing = await User.findOne({ email })
  if (existing) {
    res.status(409).json({ message: 'Email already registered' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })

  res.status(201).json({ user: publicUser(user) })
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', issues: parsed.error.issues })
    return
  }
  const { email, password } = parsed.data

  const user = await User.findOne({ email })
  const ok = user && (await bcrypt.compare(password, user.passwordHash))
  if (!user || !ok) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const { accessToken, refreshToken } = issueTokenPair(String(user._id))
  user.refreshTokenHash = hashToken(refreshToken)
  await user.save()

  setRefreshCookie(res, refreshToken)
  res.json({ user: publicUser(user), accessToken })
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined
  if (!token) {
    res.status(401).json({ message: 'No refresh token' })
    return
  }

  try {
    const payload = verifyRefreshToken(token)
    if (payload.type !== 'refresh') throw new Error('wrong type')

    const user = await User.findById(payload.sub)
    if (!user || user.refreshTokenHash !== hashToken(token)) {
      res.status(401).json({ message: 'Invalid refresh token' })
      return
    }

    // Rotation: new pair every refresh — old refresh token dies immediately
    const { accessToken, refreshToken } = issueTokenPair(String(user._id))
    user.refreshTokenHash = hashToken(refreshToken)
    await user.save()

    setRefreshCookie(res, refreshToken)
    res.json({ user: publicUser(user), accessToken })
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined
  if (token) {
    try {
      const payload = verifyRefreshToken(token)
      await User.findByIdAndUpdate(payload.sub, { refreshTokenHash: null })
    } catch {
      // expired/invalid token — still clear the cookie below
    }
  }
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/api/v1/auth',
  })
  res.json({ message: 'Logged out' })
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  const user = await User.findById(req.userId)
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  res.json({ user: { ...publicUser(user), memberSince: user.createdAt?.toISOString() ?? null } })
}