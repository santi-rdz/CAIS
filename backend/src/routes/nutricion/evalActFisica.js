import { Router } from 'express'
import { EvalActFisicaController } from '#controllers/nutricion/evalActFisica.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import {
  validateEvalActFisica,
  validatePartialEvalActFisica,
} from '@cais/shared/schemas/nutricion/evalActFisica'

export const evalActFisicaRouter = Router()

evalActFisicaRouter.use(requireAuth)

evalActFisicaRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), EvalActFisicaController.getAll)
  .post(validate(validateEvalActFisica), EvalActFisicaController.create)

evalActFisicaRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(EvalActFisicaController.getById)
  .patch(validate(validatePartialEvalActFisica), EvalActFisicaController.update)
  .delete(EvalActFisicaController.delete)
