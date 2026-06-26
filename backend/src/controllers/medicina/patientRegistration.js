import { MedicalHistoryModel } from '#models/medicina/MedicalHistory.js'
import { makePatientRegistrationController } from '#controllers/patientRegistration.js'
import { ENTIDADES } from '@cais/shared/constants/users'

export const MedicalPatientRegistrationController = makePatientRegistrationController({
  createHistory: (data, userId, tx) => MedicalHistoryModel.create(data, userId, tx),
  historiaEntidad: ENTIDADES.HISTORIA_MEDICA,
  errorLabel: 'medicina',
})
