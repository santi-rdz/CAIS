import z from 'zod'

const userSchema = z.object({
  nombre: z.string().min(2),
  correo: z.string().email(),
  fechaNacimiento: z.string(),
  telefono: z.string().regex(/^\d{8,15}$/),
  rol: z.enum(['PASANTE', 'COORDINADOR', 'SUPER_ADMIN']),
  area: z.enum(['MEDICINA', 'NUTRICION', 'PSICOLOGIA', 'PSIQUIATRIA']).optional(),
  password: z.string().min(8),
  foto: z.string().url().optional(),
  matricula: z.string().optional(),
  inicio_servicio: z.string().optional(),
  fin_servicio: z.string().optional(),
})

export function validateUser(input) {
  return userSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input)
}
