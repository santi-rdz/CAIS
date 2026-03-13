import { z } from 'zod'
import { correoSchema } from './fields.js'

const invitationSchema = z.object({
  email: correoSchema,
  role: z.enum(['pasante', 'coordinador'], {
    errorMap: () => ({ message: 'El rol debe ser pasante o coordinador' }),
  }),
})

export function validateInvitedUser(input) {
  return z
    .array(invitationSchema)
    .min(1, 'Debe incluir al menos un correo')
    .safeParse(input)
}
