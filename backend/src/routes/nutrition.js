import { Router } from 'express'
import { requireAuth } from '#middleware/auth.js'
import { biochemicalEvalRouter } from './nutricion/biochemicalEval.js'

export const nutritionRouter = Router()

nutritionRouter.use(requireAuth)

nutritionRouter.use('/evaluacion-bioquimica', biochemicalEvalRouter)
