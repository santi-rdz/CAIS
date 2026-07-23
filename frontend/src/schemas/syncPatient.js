import { z } from 'zod'
import { patientSchema } from '@cais/shared/schemas/medicina/patient'

// Shape del paciente para el modo sincronización: cada campo queda opcional y
// tolera '' (los compartidos van ocultos y vacíos, no deben bloquear), pero se
// conserva la validación real (correo, enums, etc.) de los complementarios que
// el usuario sí llena. El backend revalida con patientSchema.partial().
export const syncPatientShape = Object.fromEntries(
  Object.entries(patientSchema.shape).map(([key, schema]) => [
    key,
    z.preprocess((v) => (v === '' ? undefined : v), schema.optional()),
  ])
)
