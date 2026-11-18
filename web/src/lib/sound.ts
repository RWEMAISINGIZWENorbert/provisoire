import { Howl } from 'howler'

export type SoundName = 'correct' | 'wrong' | 'success' | 'levelup'

/** Drop real .mp3/.ogg files here later — fallback synth is used until then. */
const FILES: Record<SoundName, string> = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  success: '/sounds/success.mp3',
  levelup: '/sounds/levelup.mp3',
}

const howls = new Map<SoundName, Howl>()
const failedFiles = new Set<SoundName>()

function playFile(name: SoundName): boolean {
  if (failedFiles.has(name)) return false
  let howl = howls.get(name)
  if (!howl) {
    howl = new Howl({
      src: [FILES[name]],
      volume: 0.5,
      onloaderror: () => failedFiles.add(name),
    })
    howls.set(name, howl)
  }
  howl.play()
  return true
}

// ── Web Audio fallback synth ──────────────────────────────────
let ctx: AudioContext | null = null

function ac(): AudioContext {
  ctx ??= new AudioContext()
  return ctx
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  volume = 0.12,
) {
  const c = ac()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t = c.currentTime + start
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

function synth(name: SoundName) {
  switch (name) {
    case 'correct': // bright two-note chime
      tone(660, 0, 0.12)
      tone(880, 0.09, 0.18)
      break
    case 'wrong': // low buzz
      tone(180, 0, 0.22, 'square', 0.08)
      tone(140, 0.05, 0.2, 'square', 0.06)
      break
    case 'success': // ascending arpeggio
      ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22))
      break
    case 'levelup': // fanfare
      ;[523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.25, 'triangle', 0.14))
      break
  }
}

export function playSound(name: SoundName) {
  // Resume context on first user gesture (browser autoplay policy)
  void ac().resume()
  // If a real file exists it plays; missing files mark the name failed → synth forever after.
  if (!playFile(name)) synth(name)
}