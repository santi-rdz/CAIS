import { evolutionNoteSchema } from '@cais/shared/schemas/medicina/evolutionNote'
import { fechaHoraFormFields } from '@cais/shared/schemas/fields'

export const evolutionNoteFormSchema = evolutionNoteSchema
  .omit({ creado_at: true, historia_medica_id: true })
  .extend(fechaHoraFormFields)
