import { Router } from 'express'
import { requireAuth, requireArea } from '#middleware/auth.js'
import { AREAS } from '@cais/shared/constants/users'
import { nutritionHistoryRouter } from './nutricion/nutritionHistory.js'
import { biochemicalEvalRouter } from './nutricion/biochemicalEval.js'
import { nutritionalEvalRouter } from './nutricion/nutritionalEval.js'

export const nutritionRouter = Router()

nutritionRouter.use(requireAuth)
nutritionRouter.use(requireArea(AREAS.NUTRICION))

nutritionRouter.use('/historias-nutricion', nutritionHistoryRouter)
nutritionRouter.use('/evaluacion-bioquimica', biochemicalEvalRouter)
nutritionRouter.use('/evaluacion-nutricional', nutritionalEvalRouter)
