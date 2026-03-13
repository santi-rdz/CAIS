import { z } from 'zod'

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
