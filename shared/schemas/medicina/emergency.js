import { z } from 'zod'
import { telefonoSchema, isoDateTimeSchema, str, text } from '../fields.js'

// Schema único para backend y form
export const emergencySchema = z.object({
  ubicacion: z
    .string({ error: 'Debe ser texto' })
    .min(1, 'La ubicación es requerida')
    .max(255, 'La ubicación debe tener máximo 255 caracteres'),
  nombre: str(),
  matricula: str(20),
  telefono: telefonoSchema.nullish().or(z.literal('')),
  diagnostico: text(),
  accion_realizada: text(),
  tratamiento_admin: text(),
  recurrente: z.boolean().optional().default(false),
  fecha_hora: isoDateTimeSchema,
})

export function validateEmergency(input) {
  return emergencySchema.safeParse(input)
}

export function validatePartialEmergency(input) {
  return emergencySchema.partial().safeParse(input)
}
