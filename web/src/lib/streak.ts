/** Streak logic — all "days" are evaluated in Africa/Kigali time. */

const TZ = 'Africa/Kigali'

/** Today's date as YYYY-MM-DD in Kigali. */
export function todayKigali(now: Date = new Date()): string {
  // en-CA locale formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function toUtcDay(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

function fromUtcDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

function addDays(dateStr: string, n: number): string {
  return fromUtcDay(toUtcDay(dateStr) + n * 86_400_000)
}

/**
 * Compute the streak after activity "today".
 * - lastActive === today → streak unchanged
 * - lastActive === yesterday → streak + 1
 * - otherwise → streak resets to 1
 */
export function nextStreak(lastActiveDate: string | null, currentStreak: number, today: string): number {
  if (lastActiveDate === today) return currentStreak
  if (lastActiveDate === addDays(today, -1)) return currentStreak + 1
  return 1
}