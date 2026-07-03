import { z } from 'zod'
import { evalBioqNutricionSchema } from '@cais/shared/schemas/nutricion/biochemicalEval'

// fecha viene como dayjs desde el DatePicker; se acepta z.any() aquí y se
// convierte a ISO string antes de enviar al backend.
export const biochemicalEvalFormSchema = evalBioqNutricionSchema
  .omit({ historia_paciente_id: true })
  .extend({ fecha: z.any().optional() })
