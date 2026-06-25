import { Router } from 'express'
import { EvalActFisicaController } from '#controllers/nutricion/evalActFisica.js'
import { requireAuth } from '#middleware/auth.js'

export const evalActFisicaRouter = Router()

evalActFisicaRouter.use(requireAuth)

evalActFisicaRouter.post('/', EvalActFisicaController.create)
evalActFisicaRouter.get('/', EvalActFisicaController.getAll)
evalActFisicaRouter.get('/:id', EvalActFisicaController.getById)
evalActFisicaRouter.patch('/:id', EvalActFisicaController.update)
evalActFisicaRouter.delete('/:id', EvalActFisicaController.delete)
