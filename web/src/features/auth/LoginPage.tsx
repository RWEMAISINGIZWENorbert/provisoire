import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { TextInput } from '@/components/ui/TextInput'
import { useToast } from '@/components/ui/ToastProvider'
import { useAuth } from '@/lib/hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { loginSchema, zodFieldErrors } from './schemas'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { signIn, isAuthenticated } = useAuth()

  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const set =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error.issues, t))
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await signIn(values.email)
      toast.success(t('auth.welcomeBack'))
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      footer={
        <p className="mt-4 text-center text-sm text-text-secondary">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-accent hover:underline">
            {t('auth.signUpLink')}
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <TextInput
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
        />
        <div>
          <PasswordInput
            label={t('auth.password')}
            autoComplete="current-password"
            value={values.password}
            onChange={set('password')}
            error={errors.password}
          />
          <div className="mt-1.5 text-right">
            <button
              type="button"
              onClick={() => toast.info(t('auth.forgotSoon'))}
              className="text-xs font-semibold text-accent hover:underline"
            >
              {t('auth.forgotPassword')}
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          {t('auth.signIn')}
        </Button>

        <p className="text-center text-xs text-text-secondary">{t('auth.demoNote')}</p>
      </form>
    </AuthLayout>
  )
}