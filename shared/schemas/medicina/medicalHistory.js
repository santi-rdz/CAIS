import { z } from 'zod'
import {
  aparatosSistemasSchema,
  informacionFisicaSchema,
  planEstudioFormSchema,
} from './evolutionNote.js'
import { optionalDateSchema } from '../fields.js'

export const antecedentes_familiaresSchema = z.object({
  padre: z.string().nullish(),
  madre: z.string().nullish(),
  abuelo_paterno: z.string().nullish(),
  abuelo_materno: z.string().nullish(),
  abuela_paterna: z.string().nullish(),
  abuela_materna: z.string().nullish(),
  otros: z.string().nullish(),
})

export const antecedentes_patologicosSchema = z.object({
  cronico_degenerativos: z.string().nullish(),
  quirurgicos: z.string().nullish(),
  hospitalizaciones: z.string().nullish(),
  traumaticos: z.string().nullish(),
  transfusionales: z.string().nullish(),
  transplantes: z.string().nullish(),
  alergicos: z.string().nullish(),
  infectocontagiosos: z.string().nullish(),
  toxicomanias: z.string().nullish(),
  covid_19: z.string().nullish(),
  psicologia_psiquiatria: z.string().nullish(),
  gyo: z.string().nullish(),
  enfermedades_congenitas: z.string().nullish(),
  enfermedades_infancia: z.string().nullish(),
})

export const antecedentes_no_patologicosSchema = z.object({
  alimentacion_adecuada: z.boolean().nullish(),
  calidad_cantidad_alimentacion: z.string().nullish(),
  higiene_adecuada: z.string().nullish(),
  actividad_fisica: z.string().nullish(),
  inmunizaciones_completas: z.boolean().nullish(),
  zoonosis: z.boolean().nullish(),
  tipo_zoonosis: z.string().nullish(),
})

export const inmunizacionesSchema = z.object({
  influenza: optionalDateSchema,
  tetanos: optionalDateSchema,
  hepatitis_b: optionalDateSchema,
  covid_19: optionalDateSchema,
  otros: z.string().nullish(),
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
  tipo_sangre: z.string().nullish(),
  vacunas_infancia_completas: z.boolean().nullish(),
  motivo_consulta: z.string().nullish(),
  historia_enfermedad_actual: z.string().nullish(),
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
  planes_estudio: planEstudioFormSchema.optional(),
  servicios: serviciosSchema.optional(),
})

export function validateMedicalHistory(input) {
  return medicalHistorySchema.safeParse(input)
}

export function validatePartialMedicalHistory(input) {
  return medicalHistorySchema.partial().safeParse(input)
}
