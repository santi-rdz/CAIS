import { z } from 'zod'
import { passwordSchema, withPasswordConfirmation } from '@cais/shared/schemas/fields'

// Form del flujo "restablecer contraseña" con token del correo. El token no lo
// captura el usuario (viene en la URL), por eso no vive en este schema.
export const resetPasswordFormSchema = withPasswordConfirmation(
  z.object({
    password: passwordSchema,
    confirmPassword: z.string({ error: 'Confirma la contraseña' }),
  })
)
