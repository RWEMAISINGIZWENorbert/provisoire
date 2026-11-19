import type { IncomingMessage, ServerResponse } from 'node:http'

import app from '../src/app'
import { connectDb } from '../src/config/db'

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await connectDb()
  app(req, res)
}