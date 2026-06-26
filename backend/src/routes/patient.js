import { Router } from 'express'
import { PatientController } from '#controllers/patients.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam } from '#middleware/validate.js'
import { validatePatient, validatePartialPatient } from '@cais/shared/schemas/medicina/patient'

export const patientRouter = Router()

patientRouter.use(requireAuth)

patientRouter
  .route('/')
  .get(PatientController.getAll)
  .post(validate(validatePatient), PatientController.create)

patientRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(PatientController.getById)
  .patch(validate(validatePartialPatient), PatientController.update)
  .delete(PatientController.delete)
