import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useSound } from '@/lib/hooks/useSound'
import { useAuth } from '@/lib/hooks/useAuth'
import { MOCK_TOPICS, mockUser } from '@/lib/mock'
import { xpProgress } from '@/lib/xp'

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-text-secondary">
        {label}
      </span>
      {children}
    </div>
  )
}

export default function UtilsPreview() {
  const sound = useSound()
  const auth = useAuth()
  const xp = xpProgress(mockUser.xp)
  // const completed = MOCK_TOPICS.filter((t) =>
  //   mockUser.xp >= 0, // placeholder — real count comes from progress slice later
  // ).length

  return (
    <div className="min-h-screen bg-surface p-6 sm:p-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-text-primary">Utils & Services</h1>
          <p className="text-text-secondary">Phase 3 — sound, XP/levels, streak, mock data, auth hook.</p>
        </header>

        {/* Sound */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">Sound manager</h2>
            <Chip variant={sound.enabled ? 'success' : 'neutral'}>{sound.enabled ? 'ON' : 'MUTED'}</Chip>
          </div>
          <Row label="Feedback sounds">
            <Button size="sm" onClick={() => sound.play('correct')}>Correct chime</Button>
            <Button size="sm" variant="secondary" onClick={() => sound.play('wrong')}>Wrong buzz</Button>
            <Button size="sm" variant="secondary" onClick={() => sound.play('success')}>Success fanfare</Button>
            <Button size="sm" variant="secondary" onClick={() => sound.play('levelup')}>Level-up</Button>
          </Row>
          <Row label="Toggle">
            <Button size="sm" variant="ghost" onClick={sound.toggle}>
              {sound.enabled ? '🔊 Mute all sounds' : '🔇 Unmute sounds'}
            </Button>
          </Row>
        </Card>

        {/* XP / Level */}
        <Card className="space-y-4">
          <h2 className="font-semibold text-text-primary">XP & levels</h2>
          <Row label="Current">
            <Chip variant="accent">Lv {xp.levelIndex + 1} — {xp.levelName}</Chip>
            <span className="text-sm text-text-secondary">{mockUser.xp} XP total</span>
          </Row>
          <ProgressBar value={xp.percent} showLabel />
          <p className="text-xs text-text-secondary">
            {xp.nextLevelName ? `${xp.levelXp} / ${xp.levelSpan} XP to ${xp.nextLevelName}` : 'Max level reached'}
          </p>
        </Card>

        {/* Streak */}
        <Card className="space-y-3">
          <h2 className="font-semibold text-text-primary">Streak</h2>
          <Row label="Mock user">
            <Chip variant="warning" icon="🔥">{mockUser.streak} day streak</Chip>
          </Row>
          <p className="text-xs text-text-secondary">
            Streaks evaluate in Africa/Kigali time — see <code>lib/streak.ts</code>.
          </p>
        </Card>

        {/* Mock data */}
        <Card className="space-y-3">
          <h2 className="font-semibold text-text-primary">Mock data</h2>
          <Row label="Topics">
            <span className="text-sm text-text-secondary">{MOCK_TOPICS.length} topics loaded</span>
          </Row>
          <Row label="Questions">
            <span className="text-sm text-text-secondary">{/* count */}{Object.keys(mockUser).length && ''}— see lib/mock/content.ts</span>
          </Row>
        </Card>

        {/* Auth */}
        <Card className="space-y-4">
          <h2 className="font-semibold text-text-primary">Auth (mock)</h2>
          <Row label="Status">
            <Chip variant={auth.isAuthenticated ? 'success' : 'neutral'}>{auth.isAuthenticated ? 'Authenticated' : 'Guest'}</Chip>
          </Row>
          <Row label="Actions">
            {!auth.isAuthenticated ? (
              <Button size="sm" onClick={auth.mockLogin}>Mock login</Button>
            ) : (
              <>
                <span className="text-sm text-text-secondary">{auth.user?.name} · {auth.user?.email}</span>
                <Button size="sm" variant="danger" onClick={auth.logout}>Logout</Button>
              </>
            )}
          </Row>
        </Card>
      </div>
    </div>
  )
}