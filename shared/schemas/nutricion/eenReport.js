import { z } from 'zod'
import { optionalDateSchema, str, num, text } from '../fields'

const bool = () => z.boolean().nullish()

export const diagnosticoNutricionalSchema = z.object({
  reporte_een_id: z.uuid('El ID del reporte een debe ser un UUID válido'),
  pes: text(), // Diagnósticos nutricionales prioritarios
  intervencion: str(50), // Que se realizó
  objetivos: text(), // Objetivo del diagnóstico
  indicadores: text(), // No se que es
  criterio: text(), // Criterio de la doctora
  progreso: str(20), // Progreso del diagnóstico
})

const diagnosticoNutricionalNestedSchema = diagnosticoNutricionalSchema.omit({
  reporte_een_id: true,
})

export const reporteEenAdultoSchema = z.object({
  habitos_ali_obs: text(), // Observación de la doctora de los habitos de alimentación / Estilo de vida
  alteraciones_gastroin: text(), // Observaciones de la doctora de alteraciones gastrointestinales
  diagnosticos: z
    .array(diagnosticoNutricionalNestedSchema)
    .max(50, 'Máximo 50 diagnosticos por reporte')
    .optional(),
})

export const reporteEenKidSchema = z.object({
  eval_diag_edo_nutr: text(), // Evaluación y diagnóstico del estado de nutrición del paciente
  solicito_orient: bool(), // Si se solicitó orientación nutricional
  prescrip_nut_obs: text(), // Observación de la doctora de la prescripción nutricional
  educ_nut_obs: text(), // Observación de la doctora de la educación nutricional del paciente
  consejeria_nut_obs: text(), // Observación de la doctora de la consejería nutricional
  coord_aten_nut_obs: text(), // Observación de la doctora de la coordinación de la atención nutricional
})

const reporteEenObjectSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia del paciente debe ser un UUID válido'),
  fecha_eval: optionalDateSchema,
  kid: reporteEenKidSchema.optional(),
  adulto: reporteEenAdultoSchema.optional(),
})

export const reporteEenSchema = reporteEenObjectSchema.refine(
  (data) => Boolean(data.kid) !== Boolean(data.adulto),
  {
    message: 'Debe incluir únicamente los datos del reporte pediátrico o de adulto, no ambos',
    path: ['kid'],
  }
)

export function validateReporteEen(input) {
  return reporteEenSchema.safeParse(input)
}

export function validatePartialReporteEen(input) {
  return reporteEenObjectSchema.partial().safeParse(input)
}

export function validateDiagnosticoNutricional(input) {
  return diagnosticoNutricionalSchema.safeParse(input)
}
