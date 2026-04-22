import { z } from 'zod'
import {
  personaBaseFields,
  correoSchema,
  passwordSchema,
  rolesSchema,
  dateSchema,
} from './fields.js'

const tempPasswordSchema = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')

// usuarios.matricula y cedula son VarChar(20) en DB
const internFields = {
  matricula: z.string().min(1, 'La matrícula es requerida').max(20),
  servicioInicioAnio: z.string().min(1, 'Selecciona el año de inicio'),
  servicioInicioPeriodo: z.string().min(1, 'Selecciona el periodo de inicio'),
  servicioFinAnio: z.string().min(1, 'Selecciona el año de fin'),
  servicioFinPeriodo: z.string().min(1, 'Selecciona el periodo de fin'),
}

const cedulaField = {
  cedula: z.string().min(1, 'La cédula es requerida').max(20),
}

const confirmPasswordRefine = (schema) =>
  schema.refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export const internCreateSchema = z.object({
  ...personaBaseFields,
  fechaNacimiento: dateSchema,
  ...internFields,
  correo: correoSchema,
  password: tempPasswordSchema,
  rol: rolesSchema,
})

export const coordCreateSchema = z.object({
  ...personaBaseFields,
  fechaNacimiento: dateSchema,
  ...cedulaField,
  correo: correoSchema,
  password: tempPasswordSchema,
  rol: rolesSchema,
})

export function validateAdminCreate(input) {
  const rol = input?.rol
  if (rol === 'coordinador') return coordCreateSchema.safeParse(input)
  return internCreateSchema.safeParse(input)
}

export const userUpdateSchema = z
  .object({
    ...personaBaseFields,
    fechaNacimiento: dateSchema,
    ...internFields,
    ...cedulaField,
    correo: correoSchema,
    rol: rolesSchema,
    estado: z.enum(['ACTIVO', 'INACTIVO']),
  })
  .partial()

export function validateUserUpdate(input) {
  return userUpdateSchema.safeParse(input)
}

export const internSelfRegisterBaseSchema = z.object({
  ...personaBaseFields,
  fechaNacimiento: dateSchema,
  ...internFields,
  password: passwordSchema,
  confirmPassword: z.string(),
  token: z.uuid('Token inválido'),
})

export const coordSelfRegisterBaseSchema = z.object({
  ...personaBaseFields,
  fechaNacimiento: dateSchema,
  ...cedulaField,
  password: passwordSchema,
  confirmPassword: z.string(),
  token: z.uuid('Token inválido'),
})

export function validateSelfRegister(input, rol) {
  if (rol === 'COORDINADOR')
    return confirmPasswordRefine(coordSelfRegisterBaseSchema).safeParse(input)
  return confirmPasswordRefine(internSelfRegisterBaseSchema).safeParse(input)
}
