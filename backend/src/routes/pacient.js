import { Router } from 'express'
import { PacientController } from '../controllers/pacients.js'
import { requireAuth } from '../middleware/auth.js'

export const pacientRouter = Router()

pacientRouter.use(requireAuth)

pacientRouter.post('/', PacientController.create)
pacientRouter.get('/', PacientController.getAll)
pacientRouter.get('/:id', PacientController.getById)
