import { Router } from 'express'
import { requireAuth } from '#middleware/auth.js'
import { biochemicalEvalRouter } from './nutricion/biochemicalEval.js'
import { nutritionalEvalRouter } from './nutricion/nutritionalEval.js'

export const nutritionRouter = Router()

nutritionRouter.use(requireAuth)

nutritionRouter.use('/evaluacion-bioquimica', biochemicalEvalRouter)
nutritionRouter.use('/evaluacion-nutricional', nutritionalEvalRouter)
