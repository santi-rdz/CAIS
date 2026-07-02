import { Router } from 'express'
import { BiochemicalEvalController } from '#controllers/nutricion/biochemicalEval.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import {
  validateEvalBioqNutricion,
  validatePartialEvalBioqNutricion,
} from '@cais/shared/schemas/nutricion/biochemicalEval'

export const biochemicalEvalRouter = Router()

biochemicalEvalRouter.use(requireAuth)

biochemicalEvalRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), BiochemicalEvalController.getAll)
  .post(validate(validateEvalBioqNutricion), BiochemicalEvalController.create)

biochemicalEvalRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(BiochemicalEvalController.getById)
  .patch(validate(validatePartialEvalBioqNutricion), BiochemicalEvalController.update)
  .delete(BiochemicalEvalController.delete)
