import { z } from 'zod'
import { calGetNutrSchema } from '@cais/shared/schemas/nutricion/calGetNutr'

// fecha_eval viene como dayjs desde el DatePicker; se convierte a ISO antes de
// enviar. El resto de campos (antropometría, inputs GET y cantidades de EQ)
// reutilizan la validación compartida tal cual.
export const calGetNutrFormSchema = calGetNutrSchema
  .omit({ historia_paciente_id: true })
  .extend({ fecha_eval: z.any().optional() })
