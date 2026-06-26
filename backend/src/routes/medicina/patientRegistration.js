import { Router } from 'express'
import { MedicalPatientRegistrationController } from '#controllers/medicina/patientRegistration.js'
import { requireAuth } from '#middleware/auth.js'
import { validate } from '#middleware/validate.js'
import { validateMedicalRegistration } from '@cais/shared/schemas/medicina/patientRegistration'

export const medicalPatientRegistrationRouter = Router()

medicalPatientRegistrationRouter.use(requireAuth)

medicalPatientRegistrationRouter.post(
  '/',
  validate(validateMedicalRegistration),
  MedicalPatientRegistrationController.create
)
