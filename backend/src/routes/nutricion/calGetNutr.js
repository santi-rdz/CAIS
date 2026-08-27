import { Router } from 'express'
import { CalGetNutrController } from '#controllers/nutricion/calGetNutr.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidQuery, validateUuidParam } from '#middleware/validate.js'
import {
  validateCalGetNutr,
  validatePartialCalGetNutr,
} from '@cais/shared/schemas/nutricion/calGetNutr'

export const calGetNutrRouter = Router()

calGetNutrRouter.use(requireAuth)

calGetNutrRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), CalGetNutrController.getAll)
  .post(validate(validateCalGetNutr), CalGetNutrController.create)

calGetNutrRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(CalGetNutrController.getById)
  .patch(validate(validatePartialCalGetNutr), CalGetNutrController.update)
  .delete(CalGetNutrController.delete)
