import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'
import {
  nutritionHistorySchema,
  historiasMedicasNutricionSchema,
  tratamientoAltNutricionSchema,
  evalCalSuenoSchema,
  evalActFisicaNutricionSchema,
} from '@cais/shared/schemas/nutricion/nutritionHistory'
import { dayjsDateSchema } from '@cais/shared/schemas/fields'
import { syncPatientShape } from '@schemas/syncPatient'

// _deleted: flag solo-UI del borrado-con-restauración de filas. Se declara aquí
// porque el resolver de zod descarta las keys no presentes en el schema; sin
// esto, el flag no llegaría al submit y el filtrado de filas borradas fallaría.
const deletableRow = (schema) => schema.extend({ _deleted: z.boolean().optional() })

// Para filas de monitoreo la fecha viene como dayjs; se acepta z.any() aquí y
// se convierte a ISO string en cleanMonitoringRows antes de enviar al backend.
const monitoringRow = (schema) =>
  schema.extend({ fecha: z.any().optional(), _deleted: z.boolean().optional() })

export const nutritionalPatientFormSchema = z.object({
  ...patientSchema.shape,
  ...nutritionHistorySchema.omit({ paciente_id: true }).shape,
  historias_medicas_nutricion: z.array(deletableRow(historiasMedicasNutricionSchema)).optional(),
  tratamiento_alt_nutricion: z.array(deletableRow(tratamientoAltNutricionSchema)).optional(),
  eval_cal_sueno: z.array(monitoringRow(evalCalSuenoSchema)).optional(),
  eval_act_fisica_nutricion: z.array(monitoringRow(evalActFisicaNutricionSchema)).optional(),
  fecha_nacimiento: dayjsDateSchema,
})

// Sincronización con un paciente existente de otra área: los compartidos van
// ocultos (opcionales, tolerantes a vacío); se conserva la validación de los
// complementarios que sí se capturan.
export const nutritionalSyncFormSchema = z.object({
  ...syncPatientShape,
  ...nutritionHistorySchema.omit({ paciente_id: true }).shape,
  historias_medicas_nutricion: z.array(deletableRow(historiasMedicasNutricionSchema)).optional(),
  tratamiento_alt_nutricion: z.array(deletableRow(tratamientoAltNutricionSchema)).optional(),
  eval_cal_sueno: z.array(monitoringRow(evalCalSuenoSchema)).optional(),
  eval_act_fisica_nutricion: z.array(monitoringRow(evalActFisicaNutricionSchema)).optional(),
})
