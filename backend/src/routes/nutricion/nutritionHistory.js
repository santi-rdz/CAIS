import { Router } from 'express'
import { NutritionHistoryController } from '#controllers/nutricion/nutritionHistory.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam } from '#middleware/validate.js'
import {
  validateNutritionHistory,
  validatePartialNutritionHistory,
} from '@cais/shared/schemas/nutricion/nutritionHistory'

export const nutritionHistoryRouter = Router()

nutritionHistoryRouter.use(requireAuth)

nutritionHistoryRouter
  .route('/')
  .get(NutritionHistoryController.getAll)
  .post(validate(validateNutritionHistory), NutritionHistoryController.create)

nutritionHistoryRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(NutritionHistoryController.getById)
  .patch(validate(validatePartialNutritionHistory), NutritionHistoryController.update)
  .delete(NutritionHistoryController.delete)
