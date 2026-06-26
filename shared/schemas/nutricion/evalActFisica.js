import { z } from 'zod'
import { optionalDateSchema, int, str, text } from '../fields.js'

// Evaluación de actividad física — recurso propio enlazado a una historia de
// paciente de nutrición (FK historia_paciente_id).
export const evalActFisicaSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia debe ser un UUID válido'),
  fecha: optionalDateSchema,
  tipo: str(50),
  porque_no: text(),
  frecuencia: str(20),
  duracion: int({ max: 32767 }), // SmallInt
  intensidad: int({ max: 100 }), // Int
  clasif_tiempo_af: str(20),
  tiempo_de_practica: str(20),
  pensamientos_con_realizar_AF: str(50),
})

const evalActFisicaUpdateSchema = evalActFisicaSchema
  .omit({ historia_paciente_id: true })
  .partial()
  .strict()

export function validateEvalActFisica(input) {
  return evalActFisicaSchema.safeParse(input)
}

export function validatePartialEvalActFisica(input) {
  return evalActFisicaUpdateSchema.safeParse(input)
}
