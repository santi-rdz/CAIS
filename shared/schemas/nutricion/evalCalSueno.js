import { z } from 'zod'
import { optionalDateSchema, int, str } from '../fields.js'

// Evaluación de calidad del sueño — recurso propio enlazado a una historia de
// paciente de nutrición (FK historia_paciente_id).
export const evalCalSuenoSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia debe ser un UUID válido'),
  fecha: optionalDateSchema,
  horas_sueno: int({ max: 24 }), // TinyInt
  clasif_horas_sueno: str(20),
  insomnio: str(10),
  medicacion: str(10),
})

const evalCalSuenoUpdateSchema = evalCalSuenoSchema
  .omit({ historia_paciente_id: true })
  .partial()
  .strict()

export function validateEvalCalSueno(input) {
  return evalCalSuenoSchema.safeParse(input)
}

export function validatePartialEvalCalSueno(input) {
  return evalCalSuenoUpdateSchema.safeParse(input)
}
