import { Router } from 'express'
import { EmergencyController } from '../controllers/emergencies.js'
import { requireAuth } from '../middleware/auth.js'

export const emergencyRouter = new Router()

emergencyRouter.use(requireAuth)

emergencyRouter.post('/', EmergencyController.create)
emergencyRouter.get('/', EmergencyController.getAll)
emergencyRouter.get('/:id', EmergencyController.getById)
