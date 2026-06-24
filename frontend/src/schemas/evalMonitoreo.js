import { z } from 'zod'
import {
  evalCalSuenoSchema,
  evalActFisicaNutricionSchema,
} from '@cais/shared/schemas/nutricion/nutritionHistory'

// fecha viene como dayjs desde el DatePicker; se acepta z.any() aquí y se
// convierte a ISO string antes de enviar al backend.
export const evalSuenoFormSchema = evalCalSuenoSchema.extend({ fecha: z.any().optional() })

export const evalActFisicaFormSchema = evalActFisicaNutricionSchema.extend({
  fecha: z.any().optional(),
})
