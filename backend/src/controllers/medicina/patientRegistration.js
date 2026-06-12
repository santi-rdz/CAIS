import { MedicalHistoryModel } from '#models/medicina/MedicalHistory.js'
import { makePatientRegistrationController } from '#controllers/patientRegistration.js'
import { validateMedicalRegistration } from '@cais/shared/schemas/medicina/patientRegistration'
import { ENTIDADES } from '@cais/shared/constants/users'

export const MedicalPatientRegistrationController = makePatientRegistrationController({
  validate: validateMedicalRegistration,
  createHistory: (data, userId, tx) => MedicalHistoryModel.create(data, userId, tx),
  historiaEntidad: ENTIDADES.HISTORIA_MEDICA,
  errorLabel: 'medicina',
})
