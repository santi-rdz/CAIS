import z from 'zod'

const invitedUser = z.object({
  email: z.string().email('Correo electrónico inválido'),
  role: z.enum(['pasante', 'coordinador'], {
    errorMap: () => ({ message: 'El rol debe ser pasante o coordinador' }),
  }),
})

export function validateInvitedUser(input) {
  return z
    .array(invitedUser)
    .min(1, 'Debe incluir al menos un correo')
    .safeParse(input)
}
