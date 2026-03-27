import { z } from 'zod'

const antecedentes_familiaresSchema = z.object({
  padre: z.string().optional(),
  madre: z.string().optional(),
  abuelo_paterno: z.string().optional(),
  abuelo_materno: z.string().optional(),
  abuela_paterna: z.string().optional(),
  abuela_materna: z.string().optional(),
  otros: z.string().optional(),
})

const antecedentes_patologicosSchema = z.object({
  cronico_degenerativos: z.string().optional(),
  quirurgicos: z.string().optional(),
  hospitalizaciones: z.string().optional(),
  traumaticos: z.string().optional(),
  transfusionales: z.string().optional(),
  transplantes: z.string().optional(),
  alergicos: z.string().optional(),
  infectocontagiosos: z.string().optional(),
  toxicomanias: z.string().optional(),
  covid_19: z.string().optional(),
  psicologia_psiquiatria: z.string().optional(),
  gyo: z.string().optional(),
  enfermedades_congenitas: z.string().optional(),
  enfermedades_infancia: z.string().optional(),
})

const antecedentes_no_patologicosSchema = z.object({
  alimentacion_adecuada: z.boolean(),
  calidad_cantidad_alimentacion: z.string(),
  higiene_adecuada: z.boolean(),
  inmunizaciones_completas: z.boolean(),
  zoonosis: z.boolean(),
  tipo_zoonosis: z.string(),
})

const aparatos_sistemasSchema = z.object({
  neurologico: z.string().optional(),
  cardiovascular: z.string().optional(),
  respiratorio: z.string().optional(),
  hematologico: z.string().optional(),
  digestivo: z.string().optional(),
  musculoesqueletico: z.string().optional(),
  genitourinario: z.string().optional(),
  endocrinologico: z.string().optional(),
  metabolico: z.string().optional(),
  nutricional: z.string().optional(),
})

const informacion_fisicaSchema = z.object({
  peso: z.number(),
  altura: z.number(),
  pa_sistolica: z.number().int(),
  pa_diastolica: z.number().int(),
  fc: z.number().int(),
  fr: z.number().int(),
  circ_cintura: z.number(),
  circ_cadera: z.number(),
  sp_o2: z.number(),
  glucosa_capilar: z.number(),
  temperatura: z.number(),
  exploracion_fisica: z.string().optional(),
  habito_exterior: z.string().optional(),
})

const inmunizacionesSchema = z.object({
  influenza: z.coerce.date().optional(),
  tetanos: z.coerce.date().optional(),
  hepatitis_b: z.coerce.date().optional(),
  covid_19: z.coerce.date().optional(),
  otros: z.string().optional(),
})

const planes_estudioSchema = z.object({
  usuario_id: z.uuid(),
  plan_tratamiento: z.string().optional(),
  tratamiento: z.string().optional(),
  generado_en: z.coerce.date().optional(),
})

const serviciosSchema = z.object({
  gas: z.boolean().optional(),
  luz: z.boolean().optional(),
  agua: z.boolean().optional(),
  drenaje: z.boolean().optional(),
  cable_tel: z.boolean().optional(),
  internet: z.boolean().optional(),
})

export const medicalHistorySchema = z.object({
  paciente_id: z.string().uuid('El ID del paciente debe ser un UUID válido'),
  tipo_sangre: z.string().optional(),
  vacunas_infancia_completas: z.boolean().optional(),
  motivo_consulta: z.string().optional(),
  historia_enfermedad_actual: z.string().optional(),
  antecedentes_familiares: antecedentes_familiaresSchema,
  antecedentes_patologicos: antecedentes_patologicosSchema,
  antecedentes_no_patologicos: antecedentes_no_patologicosSchema,
  aparatos_sistemas: aparatos_sistemasSchema,
  informacion_fisica: informacion_fisicaSchema,
  inmunizaciones: inmunizacionesSchema,
  planes_estudio: planes_estudioSchema,
  servicios: serviciosSchema,
})

export function validateMedicalHistory(input) {
  return medicalHistorySchema.safeParse(input)
}

export function validatePartialMedicalHistory(input) {
  return medicalHistorySchema.partial().safeParse(input)
}
