import { z } from 'zod'
import { physicalExaminationSchema } from '@cais/shared/schemas/nutricion/physicalExam'

// fecha viene como dayjs desde el DatePicker; se convierte a ISO antes de enviar.
// eval_sintomas_gastroin (relación 1:N) se arma al enviar desde los auxiliares
// `presenta_sgi` + `sintomas`, así que aquí se omite y se reemplaza por ellos.
export const physicalExamFormSchema = physicalExaminationSchema
  .omit({ historia_paciente_id: true, eval_sintomas_gastroin: true })
  .extend({
    fecha: z.any().optional(),
    presenta_sgi: z.boolean().nullish(),
    sintomas: z.array(z.string()).optional(),
  })
