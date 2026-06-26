import { Router } from 'express'
import { NutritionPatientRegistrationController } from '#controllers/nutricion/patientRegistration.js'
import { requireAuth } from '#middleware/auth.js'
import { validate } from '#middleware/validate.js'
import { validateNutritionRegistration } from '@cais/shared/schemas/nutricion/patientRegistration'

export const nutritionPatientRegistrationRouter = Router()

nutritionPatientRegistrationRouter.use(requireAuth)

nutritionPatientRegistrationRouter.post(
  '/',
  validate(validateNutritionRegistration),
  NutritionPatientRegistrationController.create
)
