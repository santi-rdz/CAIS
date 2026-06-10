import { Router } from 'express'
import { NutritionHistoryController } from '#controllers/nutricion/nutritionHistory.js'
import { requireAuth } from '#middleware/auth.js'

export const nutritionHistoryRouter = Router()

nutritionHistoryRouter.use(requireAuth)

nutritionHistoryRouter.post('/', NutritionHistoryController.create)
nutritionHistoryRouter.get('/', NutritionHistoryController.getAll)
nutritionHistoryRouter.get('/:id', NutritionHistoryController.getById)
nutritionHistoryRouter.patch('/:id', NutritionHistoryController.update)
nutritionHistoryRouter.delete('/:id', NutritionHistoryController.delete)
