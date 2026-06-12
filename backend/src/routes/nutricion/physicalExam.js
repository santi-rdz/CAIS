import { Router } from 'express'
import { PhysicalExaminationController } from '#controllers/nutricion/physicalExam.js'
import { requireAuth } from '#middleware/auth.js'

export const physicalExaminationRouter = Router()

physicalExaminationRouter.use(requireAuth)

physicalExaminationRouter.post('/', PhysicalExaminationController.create)
physicalExaminationRouter.get('/', PhysicalExaminationController.getAll)
physicalExaminationRouter.get('/:id', PhysicalExaminationController.getById)
physicalExaminationRouter.patch('/:id', PhysicalExaminationController.update)
physicalExaminationRouter.delete('/:id', PhysicalExaminationController.delete)
