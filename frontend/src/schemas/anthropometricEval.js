import { z } from 'zod'
import {
  anthropometricEvalBaseSchema,
  evalAntroKidSchema,
  evalAntroAdultoSchema,
} from '@cais/shared/schemas/nutricion/anthropometricEval'

// El form decide kid vs adulto por la edad del paciente y envía solo ese bloque.
// `fecha` llega como dayjs; los indicadores de riesgo como 'true'/'false' desde el
// Select. El resto reutiliza los rangos numéricos del schema compartido (num()
// coacciona strings y admite vacíos). Los campos auto-calculados (imc, peso sin
// edema, %, ICC, ángulo de fase) no viven en el form: se derivan al enviar.
const adultoFormSchema = evalAntroAdultoSchema
  .extend({
    riesgo_cv: z.any().optional(),
    riesgo_eo_inf: z.any().optional(),
  })
  .partial()

export const antropometricaFormSchema = z.object({
  ...anthropometricEvalBaseSchema.omit({ fecha: true, imc: true }).partial().shape,
  fecha: z.any().optional(),
  kid: evalAntroKidSchema.partial().optional(),
  adulto: adultoFormSchema.optional(),
})
