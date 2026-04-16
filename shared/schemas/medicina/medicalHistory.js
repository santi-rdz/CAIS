import { z } from 'zod'
import {
  aparatosSistemasSchema,
  informacionFisicaSchema,
  planEstudioSchema,
} from './shared.js'
import { optionalDateSchema } from '../fields.js'

// antecedentes_familiares: todos VarChar(255) en DB
export const antecedentes_familiaresSchema = z.object({
  padre: z.string().trim().max(255).nullish(),
  madre: z.string().trim().max(255).nullish(),
  abuelo_paterno: z.string().trim().max(255).nullish(),
  abuelo_materno: z.string().trim().max(255).nullish(),
  abuela_paterna: z.string().trim().max(255).nullish(),
  abuela_materna: z.string().trim().max(255).nullish(),
  otros: z.string().trim().max(255).nullish(),
})

// antecedentes_patologicos: todos Text en DB, sin límite práctico
export const antecedentes_patologicosSchema = z.object({
  cronico_degenerativos: z.string().trim().nullish(),
  quirurgicos: z.string().trim().nullish(),
  hospitalizaciones: z.string().trim().nullish(),
  traumaticos: z.string().trim().nullish(),
  transfusionales: z.string().trim().nullish(),
  transplantes: z.string().trim().nullish(),
  alergicos: z.string().trim().nullish(),
  infectocontagiosos: z.string().trim().nullish(),
  toxicomanias: z.string().trim().nullish(),
  covid_19: z.string().trim().nullish(),
  psicologia_psiquiatria: z.string().trim().nullish(),
  gyo: z.string().trim().nullish(),
  enfermedades_congenitas: z.string().trim().nullish(),
  enfermedades_infancia: z.string().trim().nullish(),
})

// antecedentes_no_patologicos: campos Text en DB, sin límite práctico
export const antecedentes_no_patologicosSchema = z.object({
  alimentacion_adecuada: z.boolean().nullish(),
  calidad_cantidad_alimentacion: z.string().trim().nullish(),
  higiene_adecuada: z.string().trim().nullish(),
  actividad_fisica: z.string().trim().nullish(),
  inmunizaciones_completas: z.boolean().nullish(),
  zoonosis: z.boolean().nullish(),
  tipo_zoonosis: z.string().trim().nullish(),
})

export const inmunizacionesSchema = z.object({
  influenza: optionalDateSchema,
  tetanos: optionalDateSchema,
  hepatitis_b: optionalDateSchema,
  covid_19: optionalDateSchema,
  otros: z.string().trim().nullish(),
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
  tipo_sangre: z.string().trim().max(5).nullish(), // VarChar(5) en DB
  vacunas_infancia_completas: z.boolean().nullish(),
  motivo_consulta: z.string().trim().nullish(),
  historia_enfermedad_actual: z.string().trim().nullish(),
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
