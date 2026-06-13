import { z } from 'zod'
import { aparatosSistemasSchema, informacionFisicaSchema, planEstudioSchema } from './shared.js'
import { optionalDateSchema, str, text } from '../fields.js'

// antecedentes_familiares: todos VarChar(255) en DB
export const antecedentes_familiaresSchema = z.object({
  padre: str(),
  madre: str(),
  abuelo_paterno: str(),
  abuelo_materno: str(),
  abuela_paterna: str(),
  abuela_materna: str(),
  otros: str(),
})

// antecedentes_patologicos: todos Text en DB, sin límite práctico
export const antecedentes_patologicosSchema = z.object({
  cronico_degenerativos: text(),
  quirurgicos: text(),
  hospitalizaciones: text(),
  traumaticos: text(),
  transfusionales: text(),
  transplantes: text(),
  alergicos: text(),
  infectocontagiosos: text(),
  toxicomanias: text(),
  covid_19: text(),
  psicologia_psiquiatria: text(),
  gyo: text(),
  enfermedades_congenitas: text(),
  enfermedades_infancia: text(),
})

// antecedentes_no_patologicos: campos Text en DB, sin límite práctico
export const antecedentes_no_patologicosSchema = z.object({
  alimentacion_adecuada: z.boolean().nullish(),
  calidad_cantidad_alimentacion: text(),
  higiene_adecuada: text(),
  actividad_fisica: text(),
  inmunizaciones_completas: z.boolean().nullish(),
  zoonosis: z.boolean().nullish(),
  tipo_zoonosis: text(),
})

export const inmunizacionesSchema = z.object({
  influenza: optionalDateSchema,
  tetanos: optionalDateSchema,
  hepatitis_b: optionalDateSchema,
  covid_19: optionalDateSchema,
  otros: text(),
})

export const serviciosSchema = z.object({
  gas: z.boolean().optional(),
  luz: z.boolean().optional(),
  agua: z.boolean().optional(),
  drenaje: z.boolean().optional(),
  cable_tel: z.boolean().optional(),
  internet: z.boolean().optional(),
})

export const medicalHistoryBaseSchema = z.object({
  creado_at: optionalDateSchema,
  tipo_sangre: str(5), // VarChar(5) en DB
  vacunas_infancia_completas: z.boolean().nullish(),
  motivo_consulta: text(),
  historia_enfermedad_actual: text(),
})

export const medicalHistorySchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  ...medicalHistoryBaseSchema.shape,
  antecedentes_familiares: antecedentes_familiaresSchema.optional(),
  antecedentes_patologicos: antecedentes_patologicosSchema.optional(),
  antecedentes_no_patologicos: antecedentes_no_patologicosSchema.optional(),
  aparatos_sistemas: aparatosSistemasSchema.optional(),
  informacion_fisica: informacionFisicaSchema.optional(),
  inmunizaciones: inmunizacionesSchema.optional(),
  planes_estudio: planEstudioSchema.optional(),
  servicios: serviciosSchema.optional(),
})

export function validateMedicalHistory(input) {
  return medicalHistorySchema.safeParse(input)
}

export function validatePartialMedicalHistory(input) {
  return medicalHistorySchema.partial().safeParse(input)
}
