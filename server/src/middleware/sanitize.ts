import type { NextFunction, Request, Response } from 'express'

/** MongoDB operators ($gt, $where…) and dotted paths enable NoSQL injection. */
const isDangerousKey = (key: string) =>
  key.startsWith('$') || key.includes('.') || key.includes('\0')

function cleanValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(cleanValue)
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (isDangerousKey(k)) continue
      out[k] = cleanValue(v)
    }
    return out
  }
  return value
}

/** Strip dangerous keys from JSON bodies; shallow-clean query keys. */
export function sanitizeInput(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (req.body && typeof req.body === 'object') {
    req.body = cleanValue(req.body)
  }
  for (const key of Object.keys(req.query)) {
    if (isDangerousKey(key)) {
      delete (req.query as Record<string, unknown>)[key]
    }
  }
  next()
}