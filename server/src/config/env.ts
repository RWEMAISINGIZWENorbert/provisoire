/** Fail fast at boot if required configuration is missing. */
export function assertEnv(): void {
  const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const
  const missing = required.filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`)
  }
  if (!process.env.MONGO_URI) {
    console.warn(
      'MONGO_URI not set — falling back to mongodb://127.0.0.1:27017/provisoire',
    )
  }
}