import { Router } from 'express'
import { EmergencyController } from '../../controllers/emergencies.js'
import { requireAuth } from '../../middleware/auth.js'

export const emergencyRouter = Router()

emergencyRouter.use(requireAuth)

emergencyRouter.post('/', EmergencyController.create)
emergencyRouter.get('/', EmergencyController.getAll)
emergencyRouter.get('/:id', EmergencyController.getById)
emergencyRouter.patch('/:id', EmergencyController.update)
emergencyRouter.delete('/:id', EmergencyController.delete)
