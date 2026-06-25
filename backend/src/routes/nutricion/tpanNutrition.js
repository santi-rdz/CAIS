import { Router } from 'express'
import { TpanNutritionController } from '#controllers/nutricion/tpanNutrition.js'
import { requireAuth } from '#middleware/auth.js'

export const tpanNutritionRouter = Router()

tpanNutritionRouter.use(requireAuth)

tpanNutritionRouter.post('/', TpanNutritionController.create)
tpanNutritionRouter.get('/', TpanNutritionController.getAll)
tpanNutritionRouter.get('/:id', TpanNutritionController.getById)
tpanNutritionRouter.patch('/:id', TpanNutritionController.update)
tpanNutritionRouter.delete('/:id', TpanNutritionController.delete)
