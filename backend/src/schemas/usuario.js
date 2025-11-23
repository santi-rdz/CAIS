import z from 'zod'

const userSchema = z.object({
  // campos de persona
  name: z.string().min(5),
  email: z.string().email(),
  birthDay: z.string(),
  phone: z.string().regex(/^\d{8,15}$/),

  // campos de usuario
  rol: z.enum(['pasante', 'coordinador', 'superadmin']),
  area: z.enum(['medicina', 'nutricion']),
  password: z.string(),
  pic_url: z.string().url(),
})

export function validateUser(input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input)
}
