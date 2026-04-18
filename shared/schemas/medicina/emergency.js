import { z } from 'zod'
import { telefonoSchema, isoDateTimeSchema } from '../fields.js'

// Schema único para backend y form
export const emergencySchema = z.object({
  ubicacion: z.string().min(1, 'La ubicación es requerida').max(255),
  nombre: z.string().max(255).nullish(),
  matricula: z.string().max(20).nullish(),
  telefono: telefonoSchema.nullish().or(z.literal('')),
  diagnostico: z.string().max(255).nullish(),
  accion_realizada: z.string().max(255).nullish(),
  tratamiento_admin: z.string().max(255).nullish(),
  recurrente: z.boolean().optional().default(false),
  fecha_hora: isoDateTimeSchema,
})

export function validateEmergency(input) {
  return emergencySchema.safeParse(input)
}

export function validatePartialEmergency(input) {
  return emergencySchema.partial().safeParse(input)
}
