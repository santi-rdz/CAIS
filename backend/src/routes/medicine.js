import { Router } from 'express'
import { requireAuth, requireArea } from '#middleware/auth.js'
import { emergencyRouter } from './medicina/emergencies.js'
import { evolutionNotesRouter } from './medicina/evolutionNotes.js'
import { medicalHistoryRouter } from './medicina/medicalHistory.js'
import { AREAS } from '@cais/shared/constants/users'

const [MEDICINA] = AREAS

export const medicineRouter = Router()

medicineRouter.use(requireAuth)

medicineRouter.use('/emergencias', requireArea(MEDICINA), emergencyRouter)
medicineRouter.use('/notas-evolucion', evolutionNotesRouter)
medicineRouter.use('/historias-medicas', medicalHistoryRouter)
