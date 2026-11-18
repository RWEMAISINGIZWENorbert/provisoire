import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/lib/hooks/useAuth'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mockLogin } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-sm space-y-5 p-8 text-center">
        <div>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-accent text-2xl font-extrabold text-text-inverse">
            P
          </div>
          <h1 className="mt-4 text-xl font-bold text-text-primary">{t('login.title')}</h1>
          <p className="mt-1 text-sm text-text-secondary">{t('login.subtitle')}</p>
        </div>
        <Button
          fullWidth
          onClick={() => {
            mockLogin()
            navigate('/dashboard')
          }}
        >
          {t('login.button')}
        </Button>
        <p className="text-xs text-text-secondary">{t('login.note')}</p>
      </Card>
    </div>
  )
}