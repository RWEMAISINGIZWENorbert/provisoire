import { useCallback } from 'react'

import { nextStreak, todayKigali } from '@/lib/streak'
import { addXp, markActiveToday, setStreak } from '@/store/progressSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

/** Award XP and update the daily streak. Call once per completed activity. */
export function useReward() {
  const dispatch = useAppDispatch()
  const { streak, lastActiveDate } = useAppSelector((s) => s.progress)

  const award = useCallback(
    (xp: number) => {
      const today = todayKigali()
      dispatch(addXp(xp))
      dispatch(markActiveToday(today))
      dispatch(setStreak(nextStreak(lastActiveDate, streak, today)))
    },
    [dispatch, streak, lastActiveDate],
  )

  return { award }
}