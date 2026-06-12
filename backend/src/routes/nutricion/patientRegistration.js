import { Router } from 'express'
import { NutritionPatientRegistrationController } from '#controllers/nutricion/patientRegistration.js'
import { requireAuth } from '#middleware/auth.js'

export const nutritionPatientRegistrationRouter = Router()

nutritionPatientRegistrationRouter.use(requireAuth)

nutritionPatientRegistrationRouter.post('/', NutritionPatientRegistrationController.create)
