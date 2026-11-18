const brand = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

const semantic = [
  { name: 'accent', cls: 'bg-accent' },
  { name: 'success', cls: 'bg-success' },
  { name: 'error', cls: 'bg-error' },
  { name: 'warning', cls: 'bg-warning' },
  { name: 'info', cls: 'bg-info' },
] as const

const surfaces = [
  { name: 'surface', cls: 'bg-surface border border-border' },
  { name: 'surface-raised', cls: 'bg-surface-raised border border-border' },
  { name: 'surface-sunken', cls: 'bg-surface-sunken border border-border' },
] as const

export default function TokensPreview() {
  return (
    <div className="min-h-screen bg-surface p-8 text-text-primary">
      <div className="mx-auto max-w-4xl space-y-10">
        <header>
          <h1 className="text-2xl font-bold">Design Tokens</h1>
          <p className="text-text-secondary">
            Phase 1 review — palette, type, surfaces. Toggle dark mode to verify theming.
          </p>
        </header>

        {/* Brand scale */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Brand scale</h2>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {brand.map((n) => (
              <div key={n} className="text-center">
                <div
                  className="h-14 rounded-lg border border-border"
                  style={{ background: `var(--brand-${n})` }}
                />
                <span className="mt-1 block text-xs text-text-secondary">{n}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Semantic */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Semantic</h2>
          <div className="flex flex-wrap gap-3">
            {semantic.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className={`h-10 w-10 rounded-lg ${s.cls}`} />
                <span className="text-sm">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Surfaces */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Surfaces</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {surfaces.map((s) => (
              <div key={s.name} className={`rounded-xl p-4 shadow-card ${s.cls}`}>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-text-secondary">Card surface example</p>
              </div>
            ))}
          </div>
        </section>

        {/* Type scale */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Typography — Outfit</h2>
          <div className="space-y-2 rounded-xl bg-surface-raised p-6 shadow-card">
            <p className="text-4xl font-bold">Heading 1 — Pass your provisoire</p>
            <p className="text-2xl font-semibold">Heading 2 — Learn each topic</p>
            <p className="text-lg">Body large — readable on mobile</p>
            <p className="text-sm text-text-secondary">Secondary text — hints, captions</p>
            <p className="text-xs text-text-secondary">Caption / label text</p>
          </div>
        </section>

        {/* Radius & shadow */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Radius & elevation</h2>
          <div className="flex flex-wrap items-end gap-4">
            {['rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full'].map((r) => (
              <div
                key={r}
                className={`flex h-20 w-20 items-center justify-center bg-accent-soft text-accent ${r}`}
              >
                <span className="text-xs font-medium">{r}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-surface-raised px-6 py-4 shadow-pop">
              <p className="text-sm font-medium">shadow-pop (modals, snackbars)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}