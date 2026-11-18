import { useCallback } from 'react'

import { playSound, type SoundName } from '@/lib/sound'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleSound } from '@/store/uiSlice'

/** Sound toggle + playback, respecting the user's mute setting. */
export function useSound() {
  const enabled = useAppSelector((s) => s.ui.soundOn)
  const dispatch = useAppDispatch()

  const play = useCallback(
    (name: SoundName) => {
      if (enabled) playSound(name)
    },
    [enabled],
  )

  const toggle = useCallback(() => dispatch(toggleSound()), [dispatch])

  return { enabled, play, toggle }
}