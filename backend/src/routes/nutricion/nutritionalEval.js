import { Router } from 'express'
import { NutritionalEvalController } from '#controllers/nutricion/nutritionalEval.js'
import { requireAuth } from '#middleware/auth.js'

export const nutritionalEvalRouter = Router()

nutritionalEvalRouter.use(requireAuth)

nutritionalEvalRouter.post('/', NutritionalEvalController.create)
nutritionalEvalRouter.get('/', NutritionalEvalController.getAll)
nutritionalEvalRouter.get('/:id', NutritionalEvalController.getById)
nutritionalEvalRouter.patch('/:id', NutritionalEvalController.update)
nutritionalEvalRouter.delete('/:id', NutritionalEvalController.delete)
