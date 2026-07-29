import { Router } from 'express'
import { CalGetNutrController } from '#controllers/nutricion/calGetNutr.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidQuery } from '#middleware/validate.js'
import { NotFoundError } from '#lib/appError.js'
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

// id es INT AUTO_INCREMENT en cal_get_nutr (no UUID/BINARY), a diferencia de
// la mayoría de las demás tablas. Express 5 (path-to-regexp v8) ya no admite
// restricciones regex inline en la ruta (":id(\\d+)"), así que se valida acá
// en vez de en el patrón de la ruta.
function requireNumericId(req, res, next) {
  if (!/^\d+$/.test(req.params.id)) {
    return next(new NotFoundError('el cálculo de GET nutricional'))
  }
  next()
}

calGetNutrRouter
  .route('/:id')
  .all(requireNumericId)
  .get(CalGetNutrController.getById)
  .patch(validate(validatePartialCalGetNutr), CalGetNutrController.update)
  .delete(CalGetNutrController.delete)
