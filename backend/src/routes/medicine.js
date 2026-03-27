import { Router } from 'express'
import { requireAuth } from '#middleware/auth.js'
import { emergencyRouter } from './medicina/emergencies.js'
import { evolutionNotesRouter } from './medicina/evolutionNotes.js'
import { medicalHistoryRouter } from './medicina/medicalHistory.js'

export const medicineRouter = Router()

medicineRouter.use(requireAuth)

medicineRouter.use('/emergencias', emergencyRouter)
medicineRouter.use('/notas-evolucion', evolutionNotesRouter)
medicineRouter.use('/historias-medicas', medicalHistoryRouter)
