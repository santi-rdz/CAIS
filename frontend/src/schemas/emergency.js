import { emergencySchema } from '@cais/shared/schemas/medicina/emergency'
import { fechaHoraFormFields } from '@cais/shared/schemas/fields'

// El backend persiste un único `fecha_hora`; el form lo captura partido en
// dos campos (fecha + hora) que luego se fusionan al submit.
export const emergencyFormSchema = emergencySchema
  .omit({ fecha_hora: true })
  .extend(fechaHoraFormFields)
