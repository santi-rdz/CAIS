import { z } from 'zod'
import { optionalDateSchema } from '../fields.js'

export const balanceAcidoBaseSchema = z.object({
  ph_serico: z.number().nullish(),
  saturacion_o2: z.number().nullish(),
  bicarbonato: z.number().nullish(),
  pco2_total: z.number().nullish(),
})

export const evalEstadoNutricionSchema = z.object({
  leucocitos: z.number().nullish(),
  linfocitos: z.number().nullish(),
  ctl: z.number().nullish(),
  albumina: z.number().nullish(),
  pre_albumina: z.number().nullish(),
  transferrina: z.number().nullish(),
})

export const perfilAnemiaSchema = z.object({
  eritrocitos: z.number().nullish(),
  hemoglobina: z.number().nullish(),
  hematocrito: z.number().nullish(),
  vcm: z.number().nullish(),
  homocisteina: z.number().nullish(),
  ferritina: z.number().nullish(),
  hierro: z.number().nullish(),
  cap_fij_tot_he: z.number().nullish(),
  saturacion_hierro: z.number().nullish(),
})

export const perfilEndocrinoSchema = z.object({
  glucosa: z.number().nullish(),
  hbAlc: z.number().nullish(),
  insulina: z.number().nullish(),
  tiroxina_libre: z.number().nullish(),
  triyodotironina: z.number().nullish(),
})

export const perfilInflamatorioSchema = z.object({
  pcr: z.number().nullish(),
  plaquetas: z.number().int().nullish(),
})

export const perfilLipidosSchema = z.object({
  colesterol: z.number().nullish(),
  c_hdl: z.number().nullish(),
  c_ldl: z.number().nullish(),
  trigliceridos: z.number().nullish(),
})

export const perfilOrinaSchema = z.object({
  volumen_urinario: z.number().nullish(),
  densidad: z.number().nullish(),
  alteraciones_urinarias: z.string().trim().max(20).nullish(),
  litos: z.string().trim().max(50).nullish(),
  ph: z.number().nullish(),
  cetonas: z.string().trim().max(50).nullish(),
  sodio: z.number().int().nullish(),
})

export const perfilRenalElectrolitosSchema = z.object({
  osmolaridad: z.number().nullish(),
  urea: z.number().nullish(),
  bun: z.number().nullish(),
  creatinina: z.number().nullish(),
  acido_urico: z.number().nullish(),
  sodio: z.number().nullish(),
  peso_sin_edema: z.number().nullish(),
  agua: z.number().nullish(),
  potasio: z.number().nullish(),
  fosforo: z.number().nullish(),
  calcio_serico: z.number().nullish(),
  ca_corregido: z.number().nullish(),
  producto_caP: z.number().nullish(),
  pth: z.number().nullish(),
  vitamina_d: z.number().nullish(),
  tfge: z.number().nullish(),
  albuminuria: z.number().nullish(),
})

export const evalBioqNutricionSchema = z.object({
  paciente_id: z.string().uuid('El ID del paciente debe ser un UUID válido'),
  fecha: optionalDateSchema,
  balance_acido_base: balanceAcidoBaseSchema.optional(),
  eval_estado_nutricion: evalEstadoNutricionSchema.optional(),
  perfil_anemia_nutricion: perfilAnemiaSchema.optional(),
  perfil_endocrino: perfilEndocrinoSchema.optional(),
  perfil_inflamatorio: perfilInflamatorioSchema.optional(),
  perfil_lipidos: perfilLipidosSchema.optional(),
  perfil_orina: perfilOrinaSchema.optional(),
  perfil_renal_electrolitos: perfilRenalElectrolitosSchema.optional(),
})

export function validateEvalBioqNutricion(input) {
  return evalBioqNutricionSchema.safeParse(input)
}

export function validatePartialEvalBioqNutricion(input) {
  return evalBioqNutricionSchema.partial().safeParse(input)
}
