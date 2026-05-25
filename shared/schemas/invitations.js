import { z } from 'zod'
import { correoSchema, rolSchema } from './fields.js'

const invitationSchema = z.object({
  email: correoSchema,
  role: rolSchema,
})

export function validateInvitedUser(input) {
  return z.array(invitationSchema).min(1, 'Debe incluir al menos un correo').safeParse(input)
}
