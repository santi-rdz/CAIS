import { z } from 'zod'

// BE: acepta "YYYY-MM-DD" o ISO, outputs Date para Prisma.
export const dateSchema = z.coerce.date()
export const optionalDateSchema = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.coerce.date().nullable().optional()
)

// Convierte objetos dayjs (date pickers del FE) a string 'YYYY-MM-DD'
export const dayjsDateSchema = z.preprocess(
  (v) => {
    if (!v || v === 'invalid') return ''
    if (typeof v === 'object' && typeof v.format === 'function')
      return v.isValid() ? v.format('YYYY-MM-DD') : ''
    return v
  },
  z.string().min(1, 'La fecha es requerida')
)

export const telefonoSchema = z
  .string()
  .regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')

// usuarios.nombre es VarChar(255) en DB
export const personaBaseFields = {
  nombre: z.string().min(2, 'El nombre es requerido').max(255),
  apellido: z.string().min(2, 'El apellido es requerido').max(255),
  telefono: telefonoSchema,
}

// usuarios.correo y pacientes.correo son VarChar(255) en DB
export const correoSchema = z.email('Correo electrónico inválido').max(255)

// Para formularios con domain email opcional: acepta username O email válido
export const correoFlexibleSchema = z
  .string()
  .min(1, 'Ingresa un correo o usuario')
  .max(255)
  .refine(
    (val) => {
      // Acepta username puro (sin @) O email válido (con @)
      if (!val.includes('@')) return true
      return z.email().safeParse(val).success
    },
    'Ingresa un correo válido o nombre de usuario'
  )

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial (!@#$%^&*)')

export const rolesSchema = z.enum(['pasante', 'coordinador'], {
  error: 'El rol debe ser pasante o coordinador',
})

// ISO datetime con offset para el API (ej. fecha_hora, creado_at)
export const isoDateTimeSchema = z.iso.datetime({
  offset: true,
  message: 'Fecha y hora inválidas',
})

// Campos separados fecha + hora para formularios con date/time pickers
export const fechaHoraFormFields = {
  fecha: z
    .any()
    .refine((v) => v && v !== 'invalid', { message: 'Ingresa la fecha' }),
  hora: z.any().refine((v) => v !== null && v !== undefined, {
    message: 'Ingresa la hora',
  }),
}
