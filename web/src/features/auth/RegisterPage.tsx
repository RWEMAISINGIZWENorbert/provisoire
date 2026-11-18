import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { TextInput } from '@/components/ui/TextInput'
import { useToast } from '@/components/ui/ToastProvider'
import { useAuth } from '@/lib/hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { registerSchema, zodFieldErrors } from './schemas'

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { signUp, isAuthenticated } = useAuth()

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const set =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = registerSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error.issues, t))
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await signUp(values.name, values.email)
      toast.success(t('auth.accountCreated'))
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footer={
        <p className="mt-4 text-center text-sm text-text-secondary">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            {t('auth.signInLink')}
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <TextInput
          label={t('auth.name')}
          autoComplete="name"
          placeholder="Aline Ingabire"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
        />
        <TextInput
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
        />
        <PasswordInput
          label={t('auth.password')}
          autoComplete="new-password"
          hint={t('auth.passwordHint')}
          value={values.password}
          onChange={set('password')}
          error={errors.password}
        />
        <PasswordInput
          label={t('auth.confirmPassword')}
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={set('confirmPassword')}
          error={errors.confirmPassword}
        />

        <Button type="submit" fullWidth loading={loading}>
          {t('auth.signUp')}
        </Button>

        <p className="text-center text-xs text-text-secondary">{t('auth.demoNote')}</p>
      </form>
    </AuthLayout>
  )
}