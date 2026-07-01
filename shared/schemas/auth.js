import { z } from 'zod'
import { correoSchema } from './fields.js'

// El login no aplica validación de dominio al correo (anti-enumeración y el FE
// completa el dominio @uabc.edu.mx antes de enviar); solo exige campos no vacíos.
export const loginSchema = z.object({
  email: z.string({ error: 'Correo requerido' }).trim().min(1, 'Correo requerido'),
  password: z.string({ error: 'Contraseña requerida' }).min(1, 'Contraseña requerida'),
})

export function validateLogin(input) {
  return loginSchema.safeParse(input)
}

export const forgotPasswordSchema = z.object({ correo: correoSchema })

export function validateForgotPassword(input) {
  return forgotPasswordSchema.safeParse(input)
}
