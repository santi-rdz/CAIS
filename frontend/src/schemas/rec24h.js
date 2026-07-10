import { z } from 'zod'
import { rec24hSchema, rec24hComidaSchema } from '@cais/shared/schemas/nutricion/rec24h'

// fecha_eval viene como dayjs desde el DatePicker; se convierte a ISO antes de
// enviar. `comidas` es la lista de alimentos que administra AlimentoField (cada
// ítem ya normalizado); se reutiliza el schema compartido de cada alimento.
export const rec24hFormSchema = rec24hSchema
  .omit({ historia_paciente_id: true, comidas: true })
  .extend({
    fecha_eval: z.any().optional(),
    comidas: z.array(rec24hComidaSchema).optional(),
  })
