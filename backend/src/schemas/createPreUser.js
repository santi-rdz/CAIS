import z from 'zod'
const preUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['pasante', 'coordinador', 'superadmin']),
  status: z.string(),
})

export function validatePreUser(input) {
  return z.array(preUserSchema).safeParse(input)
}
