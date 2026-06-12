import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import {
  nutritionHistorySchema,
  historiasMedicasNutricionSchema,
  tratamientoAltNutricionSchema,
} from '@cais/shared/schemas/nutricion/nutritionHistory'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'

// _deleted: flag solo-UI del borrado-con-restauración de filas. Se declara aquí
// porque el resolver de zod descarta las keys no presentes en el schema; sin
// esto, el flag no llegaría al submit y el filtrado de filas borradas fallaría.
const deletableRow = (schema) => schema.extend({ _deleted: z.boolean().optional() })

export const nutritionalPatientFormSchema = z.object({
  ...patientSchema.shape,
  ...nutritionHistorySchema.omit({ paciente_id: true }).shape,
  historias_medicas_nutricion: z.array(deletableRow(historiasMedicasNutricionSchema)).optional(),
  tratamiento_alt_nutricion: z.array(deletableRow(tratamientoAltNutricionSchema)).optional(),
  fecha_nacimiento: dayjsDateSchema,
})
