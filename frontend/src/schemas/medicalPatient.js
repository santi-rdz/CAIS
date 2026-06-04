import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { medicalHistorySchema } from '@cais/shared/schemas/medicina/medicalHistory'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'

export const medicalPatientFormSchema = z.object({
  ...patientSchema.shape,
  ...medicalHistorySchema.omit({ paciente_id: true }).shape,
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  fecha_nacimiento: dayjsDateSchema,
  creado_at: dayjsDateSchema,
})
