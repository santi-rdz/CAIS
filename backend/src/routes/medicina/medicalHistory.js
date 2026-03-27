import { Router } from 'express'
import { MedicalHistoryController } from '#controllers/medicina/medicalHistory.js'
import { requireAuth } from '#middleware/auth.js'

export const medicalHistoryRouter = Router()

medicalHistoryRouter.use(requireAuth)

medicalHistoryRouter.post('/', MedicalHistoryController.create)
medicalHistoryRouter.get('/', MedicalHistoryController.getAll)
medicalHistoryRouter.get('/:id', MedicalHistoryController.getById)
medicalHistoryRouter.patch('/:id', MedicalHistoryController.update)
medicalHistoryRouter.delete('/:id', MedicalHistoryController.delete)
