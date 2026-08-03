import { z } from 'zod'
import { optionalDateSchema, str, num } from '../fields'

const bool = () => z.boolean().nullish()

export const diagnosticoNutricionalSchema = z.object({
  reporte_een_id: z.uuid('El ID del reporte een debe ser un UUID válido'),
  pes: str(255), // Diagnósticos nutricionales prioritarios
  intervencion: str(50), // Que se realizó
  objetivos: str(255), // Objetivo del diagnóstico
  indicadores: str(255), // No se que es
  criterio: str(255), // Criterio de la doctora
  progreso: str(20), // Progreso del diagnóstico
})

export const reporteEenAdultoSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia del paciente debe ser un UUID válido'),
  fecha_eval: optionalDateSchema,
  habitos_ali_obs: str(255), // Observación de la doctora de los habitos de alimentación / Estilo de vida
  alteraciones_gastroin: str(255), // Observaciones de la doctora de alteraciones gastrointestinales
  diagnosticos: z
    .array(diagnosticoNutricionalSchema)
    .max(50, 'Máximo 50 diagnosticos por reporte')
    .optional(),
})

export const reporteEenKidSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia del paciente debe ser un UUID válido'),
  fecha_eval: optionalDateSchema,
  eval_diag_edo_nutr: str(255), // Evaluación y diagnóstico del estado de nutrición del paciente
  solicito_orient: bool(), // Si se solicitó orientación nutricional
  prescrip_nut_obs: str(255), // Observación de la doctora de la prescripción nutricional
  educ_nut_obs: str(255), // Observación de la doctora de la educación nutricional del paciente
  consejeria_nut_obs: str(255), // Observación de la doctora de la consejería nutricional
  coord_aten_nut_obs: str(255), // Observación de la doctora de la coordinación de la atención nutricional
})

export function validateReporteEENAdultoSchema(input) {
  return reporteEenAdultoSchema.safeParse(input)
}

export function validateReporteEENKidSchema(input) {
  return reporteEenKidSchema.safeParse(input)
}

export function validatePartialReporteEENAdultoSchema(input) {
  return reporteEenAdultoSchema.partial().safeParse(input)
}

export function validatePartialReporteEENKidSchema(input) {
  return reporteEenKidSchema.partial().safeParse(input)
}
