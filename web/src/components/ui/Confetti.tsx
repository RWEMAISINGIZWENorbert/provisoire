import { useMemo } from 'react'
import { motion } from 'framer-motion'

// All colors reference tokens — no raw hex in components.
const COLORS = [
  'var(--brand-500)',
  'var(--brand-400)',
  'var(--warning)',
  'var(--info)',
  'var(--error)',
  'var(--success)',
]

interface Piece {
  left: number
  delay: number
  duration: number
  size: number
  color: string
  drift: number
  rotate: number
  round: boolean
}

export function Confetti({ count = 80 }: { count?: number }) {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2.2 + Math.random() * 1.8,
        size: 6 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        drift: (Math.random() - 0.5) * 240,
        rotate: 360 + Math.random() * 720,
        round: Math.random() > 0.5,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute -top-4"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 0.5),
            backgroundColor: p.color,
            borderRadius: p.round ? '50%' : '2px',
          }}
          initial={{ y: '-5vh', x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: '110vh',
            x: p.drift,
            rotate: p.rotate,
            opacity: [1, 1, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
            opacity: { duration: p.duration, times: [0, 0.7, 0.9, 1] },
          }}
        />
      ))}
    </div>
  )
}