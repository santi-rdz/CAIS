import { Router } from 'express'
import { EvalActFisicaController } from '#controllers/nutricion/evalActFisica.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateIntParam } from '#middleware/validate.js'
import {
  validateEvalActFisica,
  validatePartialEvalActFisica,
} from '@cais/shared/schemas/nutricion/evalActFisica'

export const evalActFisicaRouter = Router()

evalActFisicaRouter.use(requireAuth)

evalActFisicaRouter
  .route('/')
  .get(EvalActFisicaController.getAll)
  .post(validate(validateEvalActFisica), EvalActFisicaController.create)

evalActFisicaRouter
  .route('/:id')
  .all(validateIntParam())
  .get(EvalActFisicaController.getById)
  .patch(validate(validatePartialEvalActFisica), EvalActFisicaController.update)
  .delete(EvalActFisicaController.delete)
