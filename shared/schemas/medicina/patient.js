import { z } from 'zod'
import { telefonoSchema, correoSchema } from '../fields.js'

export const patientSchema = z.object({
  nombre: z.string().optional(),
  fecha_nacimiento: z.string(),
  es_externo: z.boolean().optional(),
  correo: correoSchema.optional(),
  telefono: telefonoSchema.optional(),
  genero: z.string().optional(),
  domicilio: z.string().optional(),
  ocupacion: z.string().optional(),
  estado_civil: z.string().optional(),
  nivel_educativo: z.string().optional(),
  religion: z.string().optional(),
  nss: z.string().optional(),
  contacto_emergencia: z.string().optional(),
  telefono_emergencia: telefonoSchema.optional(),
  parentesco_emergencia: z.string().optional(),
})

export function validatePatient(input) {
  return patientSchema.safeParse(input)
}

export function validatePartialPatient(input) {
  return patientSchema.partial().safeParse(input)
}
