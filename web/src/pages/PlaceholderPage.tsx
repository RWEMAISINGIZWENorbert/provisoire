import type { ReactNode } from 'react'

import { Card } from '@/components/ui/Card'

export function PlaceholderPage({ title, phase, children }: { title: string; phase: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
      </div>
      <Card className="py-12 text-center">
        <p className="font-semibold text-text-primary">Coming in {phase}</p>
        <p className="mt-1 text-sm text-text-secondary">This page is a placeholder — the app shell around it is live.</p>
        {children}
      </Card>
    </div>
  )
}