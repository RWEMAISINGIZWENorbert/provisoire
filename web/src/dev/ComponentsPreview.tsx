import { useState } from 'react'

import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Confetti } from '@/components/ui/Confetti'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QuizOption, type QuizOptionState } from '@/components/ui/QuizOption'
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton'
import { TextInput } from '@/components/ui/TextInput'
import { useToast } from '@/components/ui/ToastProvider'

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {hint && <p className="text-sm text-text-secondary">{hint}</p>}
      </div>
      <Card className="space-y-6">{children}</Card>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      {children}
    </div>
  )
}

const LETTERS = ['A', 'B', 'C', 'D']

function QuizOptionDemo() {
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const stateFor = (i: number): QuizOptionState => {
    if (!revealed) return picked === i ? 'selected' : 'idle'
    if (i === 1) return 'correct'
    if (i === picked) return 'wrong'
    return 'idle'
  }

  return (
    <div className="max-w-md space-y-3">
      {LETTERS.map((l, i) => (
        <QuizOption
          key={l}
          letter={l}
          state={stateFor(i)}
          onClick={() => !revealed && setPicked(i)}
          disabled={revealed}
        >
          Sample answer option {l}
        </QuizOption>
      ))}
      <div className="flex gap-2">
        <Button size="sm" onClick={() => { setPicked(null); setRevealed(false) }}>
          Reset
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setRevealed(true)} disabled={picked === null}>
          Reveal answer
        </Button>
      </div>
    </div>
  )
}

function ToastDemo() {
  const toast = useToast()
  return (
    <Row label="Triggers">
      <Button size="sm" onClick={() => toast.success('4/5 correct · +20 XP')}>Success</Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast.error('Wrong answer', {
            description: 'Correct answer: B — Speed limit in town is 40 km/h.',
          })
        }
      >
        Error + description
      </Button>
      <Button size="sm" variant="ghost" onClick={() => toast.info('Streak saved — see you tomorrow!')}>
        Info
      </Button>
    </Row>
  )
}

function OverlayDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confetti, setConfetti] = useState(false)

  return (
    <>
      <Row label="Modal">
        <Button size="sm" onClick={() => setModalOpen(true)}>Open modal</Button>
      </Row>
      <Row label="Drawer">
        <Button size="sm" variant="secondary" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </Button>
      </Row>
      <Row label="Confetti">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setConfetti(true)
            window.setTimeout(() => setConfetti(false), 4500)
          }}
        >
          Celebrate! 🎉
        </Button>
      </Row>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Sample modal">
        <p className="text-sm text-text-secondary">
          Used for confirmations, sign details, and focused tasks. Closes on ESC, backdrop click, or the × button.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setModalOpen(false)}>Confirm</Button>
        </div>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Navigation">
        <nav className="space-y-1 text-sm font-medium">
          {['Dashboard', 'Learn', 'Practice', 'Profile'].map((item) => (
            <button
              key={item}
              className="block w-full rounded-lg px-3 py-2 text-left text-text-primary transition-colors hover:bg-accent-soft hover:text-accent"
              onClick={() => setDrawerOpen(false)}
            >
              {item}
            </button>
          ))}
        </nav>
      </Drawer>

      {confetti && <Confetti />}
    </>
  )
}

export default function ComponentsPreview() {
  return (
    <div className="min-h-screen bg-surface p-6 sm:p-10">
      <div className="mx-auto max-w-3xl space-y-10">
        <header>
          <h1 className="text-2xl font-bold text-text-primary">UI Components</h1>
          <p className="text-text-secondary">
            Phase 2 preview — every primitive with its states. New components get added here as we build them.
          </p>
        </header>

        {/* ── Button ─────────────────────────────────── */}
        <Section title="Button" hint="4 variants × 3 sizes × states">
          <Row label="Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button>Normal</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </Row>
          <Row label="Full width">
            <Button fullWidth>Full width button</Button>
          </Row>
        </Section>

        {/* ── Card ───────────────────────────────────── */}
        <Section title="Card" hint="padding presets + hoverable">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card padding="sm"><p className="text-sm font-medium">padding sm</p><p className="text-xs text-text-secondary">Compact card</p></Card>
            <Card padding="md"><p className="text-sm font-medium">padding md (default)</p><p className="text-xs text-text-secondary">Standard card</p></Card>
            <Card padding="lg"><p className="text-sm font-medium">padding lg</p><p className="text-xs text-text-secondary">Spacious card</p></Card>
            <Card hoverable onClick={() => alert('Card clicked — hover to see shadow-pop')}>
              <p className="text-sm font-medium">hoverable</p>
              <p className="text-xs text-text-secondary">Hover me / click me</p>
            </Card>
          </div>
        </Section>

        {/* ── ProgressBar ────────────────────────────── */}
        <Section title="ProgressBar" hint="fills from 0 on mount, animated">
          <div className="space-y-4">
            <ProgressBar value={35} showLabel />
            <ProgressBar value={70} variant="success" showLabel />
            <ProgressBar value={100} showLabel />
            <ProgressBar value={55} size="sm" />
          </div>
        </Section>

        {/* ── Snackbar / Toast ───────────────────────── */}
        <Section title="Snackbar (useToast)" hint="slide-up stack, auto-dismiss, per-variant colors">
          <ToastDemo />
        </Section>

        {/* ── QuizOption ─────────────────────────────── */}
        <Section title="QuizOption" hint="interactive demo — pick an answer, then reveal">
          <QuizOptionDemo />
        </Section>

        {/* ── Inputs ─────────────────────────────────── */}
        <Section title="TextInput & PasswordInput" hint="labels, hints, error states, show/hide">
          <div className="grid max-w-md gap-5">
            <TextInput label="Email" type="email" placeholder="you@example.com" />
            <TextInput label="With hint" placeholder="Username" hint="This is how you'll appear on the leaderboard" />
            <TextInput label="With error" placeholder="Password" error="Password must be at least 8 characters" />
            <PasswordInput label="Password" placeholder="Enter your password" hint="Min. 8 characters" />
          </div>
        </Section>

        {/* ── Modal / Drawer / Confetti ──────────────── */}
        <Section title="Modal · Drawer · Confetti" hint="overlays, slide-in panel, celebration burst">
          <OverlayDemo />
        </Section>

        {/* ── Avatar ─────────────────────────────────── */}
        <Section title="Avatar" hint="initials + deterministic color per name">
          <Row label="Sizes">
            <Avatar name="Aline Umutoni" size="sm" />
            <Avatar name="Aline Umutoni" size="md" />
            <Avatar name="Eric Nshimiyimana" size="lg" />
            <Avatar name="Claire" size="xl" />
          </Row>
        </Section>

        {/* ── Chip ───────────────────────────────────── */}
        <Section title="Chip" hint="streak 🔥, level ⚡, status badges">
          <Row label="Variants">
            <Chip icon="🔥">7 day streak</Chip>
            <Chip variant="accent" icon="⚡">Level 3</Chip>
            <Chip variant="success">Completed</Chip>
            <Chip variant="warning">In progress</Chip>
            <Chip variant="error">Failed</Chip>
            <Chip variant="neutral">Not started</Chip>
          </Row>
        </Section>

        {/* ── Skeleton ───────────────────────────────── */}
        <Section title="Skeleton" hint="loading placeholders">
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton variant="title" />
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-3/4" />
            </div>
            <SkeletonCard />
          </div>
        </Section>

        {/* ── EmptyState ─────────────────────────────── */}
        <Section title="EmptyState" hint="zero-data screens">
          <Card padding="none">
            <EmptyState
              icon="🛣️"
              title="No topics yet"
              description="Topics will appear here once content is published."
            />
          </Card>
        </Section>
      </div>
    </div>
  )
}