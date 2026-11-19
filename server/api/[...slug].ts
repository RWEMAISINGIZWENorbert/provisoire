import type { IncomingMessage, ServerResponse } from 'node:http'

import app from '../src/app'
import { connectDb } from '../src/config/db'

/** Vercel function: every /api/* request → Express app. */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await connectDb() // cached — cheap on warm instances
  app(req, res)
}