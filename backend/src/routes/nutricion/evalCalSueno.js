import { Router } from 'express'
import { EvalCalSuenoController } from '#controllers/nutricion/evalCalSueno.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateIntParam } from '#middleware/validate.js'
import {
  validateEvalCalSueno,
  validatePartialEvalCalSueno,
} from '@cais/shared/schemas/nutricion/evalCalSueno'

export const evalCalSuenoRouter = Router()

evalCalSuenoRouter.use(requireAuth)

evalCalSuenoRouter
  .route('/')
  .get(EvalCalSuenoController.getAll)
  .post(validate(validateEvalCalSueno), EvalCalSuenoController.create)

evalCalSuenoRouter
  .route('/:id')
  .all(validateIntParam())
  .get(EvalCalSuenoController.getById)
  .patch(validate(validatePartialEvalCalSueno), EvalCalSuenoController.update)
  .delete(EvalCalSuenoController.delete)
