import { Router } from 'express'
import { EvalCalSuenoController } from '#controllers/nutricion/evalCalSueno.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import {
  validateEvalCalSueno,
  validatePartialEvalCalSueno,
} from '@cais/shared/schemas/nutricion/evalCalSueno'

export const evalCalSuenoRouter = Router()

evalCalSuenoRouter.use(requireAuth)

evalCalSuenoRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), EvalCalSuenoController.getAll)
  .post(validate(validateEvalCalSueno), EvalCalSuenoController.create)

evalCalSuenoRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(EvalCalSuenoController.getById)
  .patch(validate(validatePartialEvalCalSueno), EvalCalSuenoController.update)
  .delete(EvalCalSuenoController.delete)
