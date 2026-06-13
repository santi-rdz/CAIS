import { z } from 'zod'
import { passwordSchema, withPasswordConfirmation } from './fields.js'

// ── Password Reset (flujo "olvidé mi contraseña") ─────────────────────

export const passwordResetSchema = withPasswordConfirmation(
  z.object({
    token: z.uuid('Token inválido'),
    password: passwordSchema,
    confirmPassword: z.string({ error: 'Confirma la contraseña' }),
  })
)

export function validatePasswordReset(input) {
  return passwordResetSchema.safeParse(input)
}

// ── Change Password (flujo desde configuración del usuario) ───────────

export const changePasswordSchema = withPasswordConfirmation(
  z
    .object({
      currentPassword: z
        .string({ error: 'Ingresa tu contraseña actual' })
        .min(1, 'Ingresa tu contraseña actual'),
      password: passwordSchema,
      confirmPassword: z.string({ error: 'Confirma la contraseña' }),
    })
    .refine((d) => d.password !== d.currentPassword, {
      message: 'La nueva contraseña no puede ser igual a la actual',
      path: ['password'],
    })
)

export function validateChangePassword(input) {
  return changePasswordSchema.safeParse(input)
}
