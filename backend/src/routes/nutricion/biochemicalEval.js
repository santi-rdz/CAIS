import { Router } from 'express'
import { BiochemicalEvalController } from '#controllers/nutricion/biochemicalEval.js'
import { requireAuth } from '#middleware/auth.js'

export const biochemicalEvalRouter = Router()

biochemicalEvalRouter.use(requireAuth)

biochemicalEvalRouter.post('/', BiochemicalEvalController.create)
biochemicalEvalRouter.get('/', BiochemicalEvalController.getAll)
biochemicalEvalRouter.get('/:id', BiochemicalEvalController.getById)
biochemicalEvalRouter.patch('/:id', BiochemicalEvalController.update)
biochemicalEvalRouter.delete('/:id', BiochemicalEvalController.delete)
