import z from 'zod'

const baseSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  correo: z.string().email('Correo electrónico inválido'),
  fechaNacimiento: z.string(),
  telefono: z.string().regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos'),
  rol: z.enum(['pasante', 'coordinador'], {
    errorMap: () => ({ message: 'El rol debe ser pasante o coordinador' }),
  }),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const createPasanteSchema = baseSchema.extend({
  matricula: z.string().min(1, 'La matrícula es requerida'),
  servicioInicioAnio: z.string(),
  servicioInicioPeriodo: z.string(),
  servicioFinAnio: z.string(),
  servicioFinPeriodo: z.string(),
})

const createCoordSchema = baseSchema.extend({
  cedula: z.string().min(1, 'La cédula es requerida'),
})

export function validateUser(input) {
  const rol = input?.rol
  if (rol === 'coordinador') return createCoordSchema.safeParse(input)
  return createPasanteSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return baseSchema.partial().safeParse(input)
}
