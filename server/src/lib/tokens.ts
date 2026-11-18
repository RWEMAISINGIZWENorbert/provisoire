import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const ACCESS_SECRET = () => {
  const s = process.env.JWT_ACCESS_SECRET
  if (!s) throw new Error('JWT_ACCESS_SECRET missing')
  return s
}
const REFRESH_SECRET = () => {
  const s = process.env.JWT_REFRESH_SECRET
  if (!s) throw new Error('JWT_REFRESH_SECRET missing')
  return s
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, ACCESS_SECRET(), { expiresIn: '15m' })
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'refresh' }, REFRESH_SECRET(), { expiresIn: '30d' })
}

export function verifyAccessToken(token: string): { sub: string } {
  return jwt.verify(token, ACCESS_SECRET()) as { sub: string }
}

export function verifyRefreshToken(token: string): { sub: string; type?: string } {
  return jwt.verify(token, REFRESH_SECRET()) as { sub: string; type?: string }
}

/** Refresh tokens are stored hashed — a DB leak doesn't expose usable tokens. */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}