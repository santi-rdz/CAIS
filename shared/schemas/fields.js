import { z } from 'zod'

// Convierte objetos dayjs (date pickers del FE) a string 'YYYY-MM-DD'
export const dayjsDateSchema = z.preprocess(
  (v) => {
    if (!v || v === 'invalid') return ''
    if (typeof v === 'object' && typeof v.format === 'function')
      return v.format('YYYY-MM-DD')
    return v
  },
  z.string().min(1, 'La fecha es requerida')
)

export const telefonoSchema = z
  .string()
  .regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')

export const personaBaseFields = {
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  telefono: telefonoSchema,
}

export const correoSchema = z.email('Correo electrónico inválido')

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
