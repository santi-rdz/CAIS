import { Router } from 'express'
import { Rec24hController } from '#controllers/nutricion/rec24h.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import { validateRec24h, validatePartialRec24h } from '@cais/shared/schemas/nutricion/rec24h'

export const rec24hRouter = Router()

rec24hRouter.use(requireAuth)

rec24hRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), Rec24hController.getAll)
  .post(validate(validateRec24h), Rec24hController.create)

rec24hRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(Rec24hController.getById)
  .patch(validate(validatePartialRec24h), Rec24hController.update)
  .delete(Rec24hController.delete)
