import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { nutritionHistorySchema } from '@cais/shared/schemas/nutricion/nutritionHistory'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'

export const nutritionalPatientFormSchema = z.object({
  ...patientSchema.shape,
  ...nutritionHistorySchema.omit({ paciente_id: true }).shape,
  fecha_nacimiento: dayjsDateSchema,
})
