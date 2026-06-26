import { Router } from 'express'
import { EvalCalSuenoController } from '#controllers/nutricion/evalCalSueno.js'
import { requireAuth } from '#middleware/auth.js'

export const evalCalSuenoRouter = Router()

evalCalSuenoRouter.use(requireAuth)

evalCalSuenoRouter.post('/', EvalCalSuenoController.create)
evalCalSuenoRouter.get('/', EvalCalSuenoController.getAll)
evalCalSuenoRouter.get('/:id', EvalCalSuenoController.getById)
evalCalSuenoRouter.patch('/:id', EvalCalSuenoController.update)
evalCalSuenoRouter.delete('/:id', EvalCalSuenoController.delete)
