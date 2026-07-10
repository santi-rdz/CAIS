import { Router } from 'express'
import { requireAuth, requireArea } from '#middleware/auth.js'
import { AREAS } from '@cais/shared/constants/users'
import { nutritionHistoryRouter } from './nutricion/nutritionHistory.js'
import { nutritionPatientRegistrationRouter } from './nutricion/patientRegistration.js'
import { biochemicalEvalRouter } from './nutricion/biochemicalEval.js'
import { nutritionalEvalRouter } from './nutricion/nutritionalEval.js'
import { physicalExaminationRouter } from './nutricion/physicalExam.js'
import { tpanNutritionRouter } from './nutricion/tpanNutrition.js'
import { evalCalSuenoRouter } from './nutricion/evalCalSueno.js'
import { evalActFisicaRouter } from './nutricion/evalActFisica.js'
import { anthropometricEvalRouter } from './nutricion/anthropometricEval.js'
import { rec24hRouter } from './nutricion/rec24h.js'

export const nutritionRouter = Router()

nutritionRouter.use(requireAuth)
nutritionRouter.use(requireArea(AREAS.NUTRICION))

nutritionRouter.use('/pacientes', nutritionPatientRegistrationRouter)
nutritionRouter.use('/historias-nutricion', nutritionHistoryRouter)
nutritionRouter.use('/evaluacion-bioquimica', biochemicalEvalRouter)
nutritionRouter.use('/evaluacion-nutricional', nutritionalEvalRouter)
nutritionRouter.use('/examinacion-fisica', physicalExaminationRouter)
nutritionRouter.use('/tpan', tpanNutritionRouter)
nutritionRouter.use('/evaluacion-sueno', evalCalSuenoRouter)
nutritionRouter.use('/evaluacion-actividad-fisica', evalActFisicaRouter)
nutritionRouter.use('/evaluacion-antropometrica', anthropometricEvalRouter)
nutritionRouter.use('/rec-24h', rec24hRouter)
