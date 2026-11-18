import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

/** Requires a valid Bearer access token. Sets req.userId. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined
  if (!token) {
    res.status(401).json({ message: 'Missing token' })
    return
  }
  try {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) throw new Error('JWT_ACCESS_SECRET missing')
    const payload = jwt.verify(token, secret) as { sub: string }
    req.userId = payload.sub
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}