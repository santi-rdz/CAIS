import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import { medicalHistorySchema } from '@cais/shared/schemas/medicina/medicalHistory'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'
import { syncPatientShape } from '@schemas/syncPatient'

export const medicalPatientFormSchema = z.object({
  ...patientSchema.shape,
  ...medicalHistorySchema.omit({ paciente_id: true }).shape,
  fecha_nacimiento: dayjsDateSchema,
  creado_at: dayjsDateSchema,
})

// Sincronización con un paciente existente de otra área: los compartidos van
// ocultos (opcionales, tolerantes a vacío); se conserva la validación de los
// complementarios que sí se capturan.
export const medicalSyncFormSchema = z.object({
  ...syncPatientShape,
  ...medicalHistorySchema.omit({ paciente_id: true }).shape,
  creado_at: dayjsDateSchema,
})
