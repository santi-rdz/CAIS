import { Router } from 'express'
import { AnthropometricEvalController } from '#controllers/nutricion/anthropometricEval.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import {
  validateAnthropometricEval,
  validatePartialAnthropometricEval,
} from '@cais/shared/schemas/nutricion/anthropometricEval'

export const anthropometricEvalRouter = Router()

anthropometricEvalRouter.use(requireAuth)

anthropometricEvalRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), AnthropometricEvalController.getAll)
  .post(validate(validateAnthropometricEval), AnthropometricEvalController.create)

anthropometricEvalRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(AnthropometricEvalController.getById)
  .patch(validate(validatePartialAnthropometricEval), AnthropometricEvalController.update)
  .delete(AnthropometricEvalController.delete)
