import { z } from 'zod'
import { tpanNutritionSchema } from '@cais/shared/schemas/nutricion/tpanNutrition'

// fecha_eval viene como dayjs desde el DatePicker y progreso como string desde el
// Select; ambos se normalizan antes de enviar. El resto de campos son texto libre
// opcional que reutiliza el schema compartido.
export const tpanFormSchema = tpanNutritionSchema.omit({ historia_paciente_id: true }).extend({
  fecha_eval: z.any().optional(),
  progreso: z.any().optional(),
})
