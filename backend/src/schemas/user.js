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

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'La confirmación de contraseña es requerida'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas nuevas no coinciden',
  path: ['confirmPassword'],
})

const internSchema = baseSchema.extend({
  matricula: z.string().min(1, 'La matrícula es requerida'),
  servicioInicioAnio: z.string(),
  servicioInicioPeriodo: z.string(),
  servicioFinAnio: z.string(),
  servicioFinPeriodo: z.string(),
})

const coordinatorSchema = baseSchema.extend({
  cedula: z.string().min(1, 'La cédula es requerida'),
})

export function validateUser(input) {
  const rol = input?.rol
  if (rol === 'coordinador') return coordinatorSchema.safeParse(input)
  return internSchema.safeParse(input)
}

export function validatePartialUser(input) {
  return baseSchema.partial().safeParse(input)
}
