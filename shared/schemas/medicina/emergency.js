import { z } from 'zod'
import { telefonoSchema } from '../fields.js'

const emergencyBaseSchema = z.object({
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  nombre: z.string().nullish(),
  matricula: z.string().nullish(),
  telefono: telefonoSchema.nullish().or(z.literal('')),
  diagnostico: z.string().nullish(),
  accion_realizada: z.string().nullish(),
  tratamiento_admin: z.string().nullish(),
  recurrente: z.boolean().optional().default(false),
})

// API — fecha_hora como ISO string
export const emergencySchema = emergencyBaseSchema.extend({
  fecha_hora: z.iso.datetime({
    offset: true,
    message: 'Fecha y hora inválidas',
  }),
})

// Form — fecha y hora como objetos dayjs del MUI picker
export const emergencyFormSchema = emergencyBaseSchema.extend({
  fecha: z
    .any()
    .refine((v) => v && v !== 'invalid', { message: 'Ingresa la fecha' }),
  hora: z.any().refine((v) => v !== null && v !== undefined, {
    message: 'Ingresa la hora',
  }),
})

export function validateEmergency(input) {
  return emergencySchema.safeParse(input)
}

export function validatePartialEmergency(input) {
  return emergencySchema.partial().safeParse(input)
}
