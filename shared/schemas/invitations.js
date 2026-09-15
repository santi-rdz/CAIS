import { z } from 'zod'
import { correoSchema, rolSchema, areaSchema } from './fields.js'

// `area` es opcional/nullable: null para rol ADMIN, requerida para el resto.
// La coherencia rol↔área y la autorización (quién puede fijar qué) se imponen
// en el backend (UserService.preRegister), no solo aquí.
const invitationSchema = z.object({
  email: correoSchema,
  role: rolSchema,
  area: areaSchema.nullable().optional(),
})

export function validateInvitedUser(input) {
  return z.array(invitationSchema).min(1, 'Debe incluir al menos un correo').safeParse(input)
}
