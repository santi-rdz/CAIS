import { Router } from 'express'
import { PatientController } from '../controllers/patients.js'
import { requireAuth } from '../middleware/auth.js'

export const patientRouter = Router()

patientRouter.use(requireAuth)

patientRouter.post('/', PatientController.create)
patientRouter.get('/', PatientController.getAll)
patientRouter.get('/:id', PatientController.getById)
patientRouter.patch('/:id', PatientController.update)
patientRouter.delete('/:id', PatientController.delete)
