import { Router } from 'express'
import { MedicalPatientRegistrationController } from '#controllers/medicina/patientRegistration.js'
import { requireAuth } from '#middleware/auth.js'

export const medicalPatientRegistrationRouter = Router()

medicalPatientRegistrationRouter.use(requireAuth)

medicalPatientRegistrationRouter.post('/', MedicalPatientRegistrationController.create)
