import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'

export const nutritionalPatientFormSchema = z.object({
  ...patientSchema.shape,
  fecha_nacimiento: dayjsDateSchema,
  motivo_consulta: z.string().max(1000).nullish(),
})
