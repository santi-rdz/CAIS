import { Router } from 'express'
import { requireAuth } from '#middleware/auth.js'
import { emergencyRouter } from './medicina/emergencies.js'
import { evolutionNotesRouter } from './medicina/evolutionNotes.js'
import { medicalHistoryRouter } from './medicina/medicalHistory.js'
import { biochemicalEvalRouter } from './nutricion/biochemicalEval.js'

export const nutritionRouter = Router()

nutritionRouter.use(requireAuth)

nutritionRouter.use('/evaluacion-bioquimica', biochemicalEvalRouter)
