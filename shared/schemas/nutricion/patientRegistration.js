import { makeRegistrationSchema } from '../patientRegistration.js'
import { patientSchema } from '../medicina/patient.js'
import { nutritionHistorySchema } from './nutritionHistory.js'

export const validateNutritionRegistration = makeRegistrationSchema(
  patientSchema,
  nutritionHistorySchema
)
