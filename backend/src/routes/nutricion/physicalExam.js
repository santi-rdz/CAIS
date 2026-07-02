import { Router } from 'express'
import { PhysicalExaminationController } from '#controllers/nutricion/physicalExam.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import {
  validatePhysicalExamination,
  validatePartialPhysicalExamination,
} from '@cais/shared/schemas/nutricion/physicalExam'

export const physicalExaminationRouter = Router()

physicalExaminationRouter.use(requireAuth)

physicalExaminationRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), PhysicalExaminationController.getAll)
  .post(validate(validatePhysicalExamination), PhysicalExaminationController.create)

physicalExaminationRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(PhysicalExaminationController.getById)
  .patch(validate(validatePartialPhysicalExamination), PhysicalExaminationController.update)
  .delete(PhysicalExaminationController.delete)
