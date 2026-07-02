import { z } from 'zod'
import { isoDateTimeSchema, text, uuidSchema } from '../fields.js'
import { aparatosSistemasSchema, informacionFisicaSchema, planEstudioSchema } from './shared.js'

// Schema único para backend y form. Toda nota pertenece a una historia médica;
// el paciente se deriva de ella, no se recibe en el body.
export const evolutionNoteSchema = z.object({
  historia_medica_id: uuidSchema,
  creado_at: isoDateTimeSchema,
  motivo_consulta: text(),
  ant_gine_andro: text(),
  estudios_complementarios_efectuados: text(),
  aparatos_sistemas: aparatosSistemasSchema.optional(),
  informacion_fisica: informacionFisicaSchema.optional(),
  planes_estudio: planEstudioSchema.optional(),
})

export function validateEvolutionNote(input) {
  return evolutionNoteSchema.safeParse(input)
}

// La historia es inmutable en update (la nota no se "mueve" de historia).
export function validatePartialEvolutionNote(input) {
  return evolutionNoteSchema.omit({ historia_medica_id: true }).partial().safeParse(input)
}
