import { Router } from 'express'
import { EmergencyController } from '#controllers/medicina/emergencies.js'
import { requireAuth } from '#middleware/auth.js'
import { validate, validateUuidParam } from '#middleware/validate.js'
import {
  validateEmergency,
  validatePartialEmergency,
} from '@cais/shared/schemas/medicina/emergency'

export const emergencyRouter = Router()

emergencyRouter.use(requireAuth)

emergencyRouter
  .route('/')
  .get(EmergencyController.getAll)
  .post(validate(validateEmergency), EmergencyController.create)

emergencyRouter
  .route('/:id')
  .all(validateUuidParam())
  .get(EmergencyController.getById)
  .patch(validate(validatePartialEmergency), EmergencyController.update)
  .delete(EmergencyController.delete)
