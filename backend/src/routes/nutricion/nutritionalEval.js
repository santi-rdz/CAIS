import { Router } from 'express'
import { NutritionalEvalController } from '#controllers/nutricion/nutritionalEval.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam } from '#middleware/validate.js'
import {
  validateNutritionalEval,
  validatePartialNutritionalEval,
} from '@cais/shared/schemas/nutricion/nutritionalEval'

export const nutritionalEvalRouter = Router()

nutritionalEvalRouter.use(requireAuth)

nutritionalEvalRouter
  .route('/')
  .get(NutritionalEvalController.getAll)
  .post(validate(validateNutritionalEval), NutritionalEvalController.create)

nutritionalEvalRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(NutritionalEvalController.getById)
  .patch(validate(validatePartialNutritionalEval), NutritionalEvalController.update)
  .delete(NutritionalEvalController.delete)
