import { NutritionHistoryModel } from '#models/nutricion/NutritionHistory.js'
import { makePatientRegistrationController } from '#controllers/patientRegistration.js'
import { ENTIDADES } from '@cais/shared/constants/users'

export const NutritionPatientRegistrationController = makePatientRegistrationController({
  createHistory: (data, _userId, tx) => NutritionHistoryModel.create(data, tx),
  historiaEntidad: ENTIDADES.HISTORIA_NUTRICION,
})
