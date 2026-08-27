import { evolutionNoteSchema } from '@cais/shared/schemas/medicina/evolutionNote'
import { fechaHoraFormFields } from '@cais/shared/schemas/fields'

export const evolutionNoteFormSchema = evolutionNoteSchema
  .omit({ expedida_en: true, historia_medica_id: true })
  .extend(fechaHoraFormFields)
