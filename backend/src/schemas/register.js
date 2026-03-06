import z from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial (!@#$%^&*)')

const registrationBaseSchema = z.object({
  token: z.string().uuid('Token inválido'),
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  fechaNacimiento: z.string(),
  telefono: z.string().regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos'),
  password: passwordSchema,
  confirmPassword: z.string(),
})

const internRegistrationSchema = registrationBaseSchema
  .extend({
    matricula: z.string().min(1, 'La matrícula es requerida'),
    servicioInicioAnio: z.string(),
    servicioInicioPeriodo: z.string(),
    servicioFinAnio: z.string(),
    servicioFinPeriodo: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const coordinatorRegistrationSchema = registrationBaseSchema
  .extend({
    cedula: z.string().min(1, 'La cédula es requerida'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

function validateInternRegistration(input) {
  return internRegistrationSchema.safeParse(input)
}

function validateCoordinatorRegistration(input) {
  return coordinatorRegistrationSchema.safeParse(input)
}

export function validateRegistration(input, rol) {
  if (rol === 'COORDINADOR') return validateCoordinatorRegistration(input)
  return validateInternRegistration(input)
}
