import { z } from 'zod'
import { patientSchema } from './patient.js'
import { medicalHistorySchema } from './medicalHistory.js'

// Registro atómico: paciente + su primera historia médica en un solo body.
// La historia va sin paciente_id (se inyecta en el servidor tras crear el paciente).
export const medicalRegistrationSchema = z.object({
  patient: patientSchema,
  historia: medicalHistorySchema.omit({ paciente_id: true }),
})

export function validateMedicalRegistration(input) {
  return medicalRegistrationSchema.safeParse(input)
}
