import { NutritionHistoryModel } from '#models/nutricion/NutritionHistory.js'
import { makePatientRegistrationController } from '#controllers/patientRegistration.js'
import { validateNutritionRegistration } from '@cais/shared/schemas/nutricion/patientRegistration'
import { ENTIDADES } from '@cais/shared/constants/users'

export const NutritionPatientRegistrationController = makePatientRegistrationController({
  validate: validateNutritionRegistration,
  createHistory: (data, _userId, tx) => NutritionHistoryModel.create(data, tx),
  historiaEntidad: ENTIDADES.HISTORIA_NUTRICION,
  errorLabel: 'nutrición',
})
