import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Card } from '@/components/ui/Card'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-2xl font-extrabold text-text-inverse">
            P
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            {t('app.name')}
          </span>
        </div>

        <Card className="space-y-5 p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-text-primary">{title}</h1>
            <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
          </div>
          {children}
        </Card>

        {footer}
      </div>
    </div>
  )
}