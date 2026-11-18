import { z } from 'zod'
import type { TFunction } from 'i18next'

export const loginSchema = z.object({
  email: z.string().min(1, 'auth.errors.emailRequired').email('auth.errors.emailInvalid'),
  password: z.string().min(1, 'auth.errors.passwordRequired').min(8, 'auth.errors.passwordMin'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'auth.errors.nameRequired'),
    email: z.string().min(1, 'auth.errors.emailRequired').email('auth.errors.emailInvalid'),
    password: z.string().min(8, 'auth.errors.passwordMin'),
    confirmPassword: z.string().min(1, 'auth.errors.confirmRequired'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'auth.errors.passwordMismatch',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>

/** Map Zod issues → { field: translatedMessage } for form error props. */
export function zodFieldErrors(
  issues: z.ZodIssue[],
  t: TFunction,
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const issue of issues) {
    const field = String(issue.path[0] ?? '')
    if (field && !errors[field]) errors[field] = t(issue.message)
  }
  return errors
}