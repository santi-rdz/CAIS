import { Router } from 'express'
import { TpanNutritionController } from '#controllers/nutricion/tpanNutrition.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import {
  validateTpanNutrition,
  validatePartialTpanNutrition,
} from '@cais/shared/schemas/nutricion/tpanNutrition'

export const tpanNutritionRouter = Router()

tpanNutritionRouter.use(requireAuth)

tpanNutritionRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), TpanNutritionController.getAll)
  .post(validate(validateTpanNutrition), TpanNutritionController.create)

tpanNutritionRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(TpanNutritionController.getById)
  .patch(validate(validatePartialTpanNutrition), TpanNutritionController.update)
  .delete(TpanNutritionController.delete)
