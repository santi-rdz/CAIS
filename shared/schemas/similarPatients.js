import { z } from 'zod'
import { dateSchema } from './fields.js'
import { SIMILAR_PATIENT_MIN_CHARS } from '../constants/patients.js'

export const similarPatientsQuerySchema = z.object({
  nombre: z.string({ error: 'Debe ser texto' }).trim().min(SIMILAR_PATIENT_MIN_CHARS),
  apellidos: z.string({ error: 'Debe ser texto' }).trim().min(SIMILAR_PATIENT_MIN_CHARS),
  fecha_nacimiento: dateSchema,
  genero: z.string({ error: 'Debe ser texto' }).min(1),
})

export function validateSimilarPatientsQuery(input) {
  return similarPatientsQuerySchema.safeParse(input)
}
