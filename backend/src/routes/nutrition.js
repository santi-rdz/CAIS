import { Router } from 'express'
import { requireAuth, requireArea } from '#middleware/auth.js'
import { AREAS } from '@cais/shared/constants/users'
import { nutritionHistoryRouter } from './nutricion/nutritionHistory.js'
import { nutritionPatientRegistrationRouter } from './nutricion/patientRegistration.js'
import { biochemicalEvalRouter } from './nutricion/biochemicalEval.js'
import { nutritionalEvalRouter } from './nutricion/nutritionalEval.js'
import { physicalExaminationRouter } from './nutricion/physicalExam.js'
export const nutritionRouter = Router()

nutritionRouter.use(requireAuth)
nutritionRouter.use(requireArea(AREAS.NUTRICION))

nutritionRouter.use('/pacientes', nutritionPatientRegistrationRouter)
nutritionRouter.use('/historias-nutricion', nutritionHistoryRouter)
nutritionRouter.use('/evaluacion-bioquimica', biochemicalEvalRouter)
nutritionRouter.use('/evaluacion-nutricional', nutritionalEvalRouter)
nutritionRouter.use('/examinacion-fisica', physicalExaminationRouter)
