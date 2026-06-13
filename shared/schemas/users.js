import { z } from 'zod'
import {
  personalFields,
  pasanteFields,
  coordinadorFields,
  correoSchema,
  dateSchema,
  rolSchema,
  areaSchema,
  estadoSchema,
  basicPasswordSchema,
  passwordSchema,
  withPasswordConfirmation,
} from './fields.js'
import { ROLES } from '../constants/users.js'

// ── Creación de usuario (base para backend y frontend) ────────────────

export const pasanteSchema = z.object({
  ...personalFields,
  fecha_nacimiento: dateSchema,
  ...pasanteFields,
  correo: correoSchema,
  password: basicPasswordSchema,
  rol: rolSchema,
  area: areaSchema.optional(),
})

export const coordinadorSchema = z.object({
  ...personalFields,
  fecha_nacimiento: dateSchema,
  ...coordinadorFields,
  correo: correoSchema,
  password: basicPasswordSchema,
  rol: rolSchema,
  area: areaSchema.optional(),
})

export function validateUserCreate(input) {
  const rol = input?.rol?.toUpperCase()
  if (rol === ROLES.COORDINADOR) return coordinadorSchema.safeParse(input)
  return pasanteSchema.safeParse(input)
}

// ── Registro de usuario por token (Registro propio) ─────────────────────

const signupFields = {
  password: passwordSchema,
  confirmPassword: z.string({ error: 'Confirma la contraseña' }),
  token: z.uuid('Token inválido'),
}

const omitForSignup = { correo: true, rol: true, area: true, password: true }

export const pasanteSignupSchema = pasanteSchema.omit(omitForSignup).extend(signupFields)

export const coordinadorSignupSchema = coordinadorSchema.omit(omitForSignup).extend(signupFields)

export function validateSignup(input, rol) {
  if (rol === ROLES.COORDINADOR)
    return withPasswordConfirmation(coordinadorSignupSchema).safeParse(input)
  return withPasswordConfirmation(pasanteSignupSchema).safeParse(input)
}

// ── Actualización parcial ─────────────────────────────────────────────

export const userUpdateSchema = z
  .object({
    ...personalFields,
    fecha_nacimiento: dateSchema,
    ...pasanteFields,
    ...coordinadorFields,
    correo: correoSchema,
    rol: rolSchema,
    area: areaSchema,
    estado: estadoSchema,
  })
  .partial()

export function validateUserUpdate(input) {
  return userUpdateSchema.safeParse(input)
}
