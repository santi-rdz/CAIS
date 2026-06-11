import { z } from 'zod'
import { patientSchema } from '../medicina/patient.js'
import { nutritionHistorySchema } from './nutritionHistory.js'

// Registro atómico: paciente + su primera historia nutricional en un solo body.
// La historia va sin paciente_id (se inyecta en el servidor tras crear el paciente).
export const nutritionRegistrationSchema = z.object({
  patient: patientSchema,
  historia: nutritionHistorySchema.omit({ paciente_id: true }),
})

export function validateNutritionRegistration(input) {
  return nutritionRegistrationSchema.safeParse(input)
}
