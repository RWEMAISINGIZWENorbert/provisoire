import type { NextFunction, Request, Response } from 'express'

/** Central error handler — must be registered last. */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Duplicate key (e.g. unique email race)
  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({ message: 'Already exists' })
    return
  }
  // Mongoose CastError / ValidationError
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    res.status(400).json({ message: 'Invalid data' })
    return
  }
  // Zod errors thrown outside safeParse
  if (err.name === 'ZodError') {
    res.status(400).json({ message: 'Validation failed' })
    return
  }
  console.error(err)
  // Never leak internals in production
  const message =
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  res.status(500).json({ message })
}