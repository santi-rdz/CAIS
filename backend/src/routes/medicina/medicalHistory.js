import { Router } from 'express'
import { MedicalHistoryController } from '#controllers/medicina/medicalHistory.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam } from '#middleware/validate.js'
import {
  validateMedicalHistory,
  validatePartialMedicalHistory,
} from '@cais/shared/schemas/medicina/medicalHistory'

export const medicalHistoryRouter = Router()

medicalHistoryRouter.use(requireAuth)

medicalHistoryRouter
  .route('/')
  .get(MedicalHistoryController.getAll)
  .post(validate(validateMedicalHistory), MedicalHistoryController.create)

medicalHistoryRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(MedicalHistoryController.getById)
  .patch(validate(validatePartialMedicalHistory), MedicalHistoryController.update)
  .delete(MedicalHistoryController.delete)
