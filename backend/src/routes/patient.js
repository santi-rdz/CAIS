import { Router } from 'express'
import { PatientController } from '#controllers/patients.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateQuery, validateUuidParam } from '#middleware/validate.js'
import { validatePatient, validatePartialPatient } from '@cais/shared/schemas/medicina/patient'
import { validateSimilarPatientsQuery } from '@cais/shared/schemas/similarPatients'

export const patientRouter = Router()

patientRouter.use(requireAuth)

patientRouter
  .route('/')
  .get(PatientController.getAll)
  .post(validate(validatePatient), PatientController.create)

patientRouter.get(
  '/similares',
  validateQuery(validateSimilarPatientsQuery),
  PatientController.getSimilar
)

patientRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(PatientController.getById)
  .patch(validate(validatePartialPatient), PatientController.update)
  .delete(PatientController.delete)
