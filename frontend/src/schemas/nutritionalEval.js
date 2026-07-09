import { z } from 'zod'
import {
  nutritionalEvalSchema,
  horariosComidaNutricionSchema,
} from '@cais/shared/schemas/nutricion/nutritionalEval'

// Las horas se capturan como dayjs (TimePicker) y se serializan a 'HH:mm' antes
// de enviar; se aceptan como z.any() aquí para no chocar con el str(20) del
// shared mientras siguen siendo objetos dayjs en el form.
const timeField = z.any().optional()

const horariosFormSchema = horariosComidaNutricionSchema.extend({
  hora_desayuno: timeField,
  hora_comida: timeField,
  hora_cena: timeField,
  hora_colac_1: timeField,
  hora_colac_2: timeField,
  hora_colac_3: timeField,
  hora_despierto: timeField,
})

// fecha viene como dayjs desde el DatePicker; se convierte a ISO antes de enviar.
export const nutritionalEvalFormSchema = nutritionalEvalSchema
  .omit({ historia_paciente_id: true })
  .extend({
    fecha: z.any().optional(),
    horarios_comida_nutricion: horariosFormSchema.optional(),
  })
