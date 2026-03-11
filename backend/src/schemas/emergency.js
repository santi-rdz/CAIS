import z from 'zod'

const emergencySchema = z.object({
  fecha_hora: z.iso.datetime({
    error: 'La fecha y hora debe tener un formato ISO 8601 válido',
  }),
  ubicacion: z.string().min(1, 'La ubicación es requerida'),
  nombre: z.string().optional(),
  matricula: z.string().optional(),
  telefono: z
    .string()
    .regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')
    .optional(),
  diagnostico: z.string().optional(),
  accion_realizada: z.string().optional(),
  tratamiento_admin: z.string().optional(),
  recurrente: z.boolean().optional().default(false),
})

export function validateEmergency(input) {
  return emergencySchema.safeParse(input)
}

export function validatePartialEmergency(input) {
  return emergencySchema.partial().safeParse(input)
}
