import { Router } from 'express'
import { requireAuth, requireArea } from '#middleware/auth.js'
import { emergencyRouter } from './medicina/emergencies.js'
import { evolutionNotesRouter } from './medicina/evolutionNotes.js'
import { medicalHistoryRouter } from './medicina/medicalHistory.js'
import { medicalPatientRegistrationRouter } from './medicina/patientRegistration.js'
import { AREAS } from '@cais/shared/constants/users'
// Add router
export const medicineRouter = Router()

medicineRouter.use(requireAuth)
medicineRouter.use(requireArea(AREAS.MEDICINA))

medicineRouter.use('/pacientes', medicalPatientRegistrationRouter)
medicineRouter.use('/emergencias', emergencyRouter)
medicineRouter.use('/notas-evolucion', evolutionNotesRouter)
medicineRouter.use('/historias-medicas', medicalHistoryRouter)
