import { z } from 'zod'
import { correoSchema, rolesSchema } from './fields.js'

const invitationSchema = z.object({
  email: correoSchema,
  role: rolesSchema,
})

export function validateInvitedUser(input) {
  return z
    .array(invitationSchema)
    .min(1, 'Debe incluir al menos un correo')
    .safeParse(input)
}
