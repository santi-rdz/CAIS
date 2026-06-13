import { z } from 'zod'
import { num, int, str, text } from '../fields.js'

// ─── Schemas compartidos entre evolutionNote y medicalHistory ────────

export const aparatosSistemasSchema = z.object({
  neurologico: text(),
  cardiovascular: text(),
  respiratorio: text(),
  hematologico: text(),
  digestivo: text(),
  musculoesqueletico: text(),
  genitourinario: text(),
  endocrinologico: text(),
  metabolico: text(),
  nutricional: text(),
})

export const informacionFisicaSchema = z
  .object({
    peso: num({ max: 500 }),
    altura: num({ max: 300 }),
    pa_sistolica: int({ max: 300 }),
    pa_diastolica: int({ max: 200 }),
    fc: int({ max: 300 }),
    fr: int({ max: 120 }),
    circ_cintura: num({ max: 300 }),
    circ_cadera: num({ max: 300 }),
    sp_o2: num({ max: 100 }),
    glucosa_capilar: num({ max: 1000 }),
    temperatura: num({ max: 45 }),
    exploracion_fisica: text(),
    habito_exterior: text(),
  })
  .partial()

// planes_estudio_cie10.codigo es VarChar(10) en DB
const cie10ItemSchema = z.object({
  codigo: str(10),
  descripcion: text(),
})

export const planEstudioSchema = z.object({
  plan_tratamiento: text(),
  tratamiento: text(),
  estudios_complementarios: text(),
  cie10_codes: z.array(cie10ItemSchema).optional(),
})
