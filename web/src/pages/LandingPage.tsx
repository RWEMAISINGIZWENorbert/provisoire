import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="flex items-center gap-2.5 px-6 py-5 sm:px-10">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-lg font-extrabold text-text-inverse">
          P
        </div>
        <span className="text-lg font-bold tracking-tight text-text-primary">
          {t('app.name')}
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
            {t('landing.title')}
          </h1>
          <p className="mt-4 text-lg text-text-secondary">{t('landing.subtitle')}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg">{t('landing.getStarted')}</Button>
            </Link>
            <Link to="/practice">
              <Button size="lg" variant="secondary">
                {t('landing.practiceNow')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}