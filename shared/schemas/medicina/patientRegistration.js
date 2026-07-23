import { makeRegistrationSchema } from '../patientRegistration.js'
import { patientSchema } from './patient.js'
import { medicalHistorySchema } from './medicalHistory.js'

export const validateMedicalRegistration = makeRegistrationSchema(
  patientSchema,
  medicalHistorySchema
)
