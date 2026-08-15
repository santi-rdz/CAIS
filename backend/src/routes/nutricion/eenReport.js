import { Router } from 'express'
import { ReporteEenController } from '#controllers/nutricion/eenReport.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam, validateUuidQuery } from '#middleware/validate.js'
import {
  validateReporteEen,
  validatePartialReporteEen,
} from '@cais/shared/schemas/nutricion/eenReport'

export const reporteEenRouter = Router()

reporteEenRouter.use(requireAuth)

reporteEenRouter
  .route('/')
  .get(validateUuidQuery('historia_paciente_id'), ReporteEenController.getAll)
  .post(validate(validateReporteEen), ReporteEenController.create)

// id es UUID/BINARY(16), pero puede estar en cualquiera de las dos tablas
// (kid o adulto) — el modelo prueba ambas, ver ReporteEenModel.getById.
reporteEenRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(ReporteEenController.getById)
  .patch(validate(validatePartialReporteEen), ReporteEenController.update)
  .delete(ReporteEenController.delete)
