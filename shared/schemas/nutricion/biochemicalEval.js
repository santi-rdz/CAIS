import { z } from 'zod'
import { optionalDateSchema, num, int, str } from '../fields.js'

const labNum = num({ max: 100000 })
const percent = num({ max: 100 })
const phScale = num({ max: 14 })

export const balanceAcidoBaseSchema = z.object({
  ph_serico: phScale,
  saturacion_o2: percent,
  bicarbonato: labNum,
  pco2_total: labNum,
})

export const evalEstadoNutricionSchema = z.object({
  leucocitos: labNum,
  linfocitos: labNum,
  ctl: labNum,
  albumina: labNum,
  pre_albumina: labNum,
  transferrina: labNum,
})

export const perfilAnemiaSchema = z.object({
  eritrocitos: labNum,
  hemoglobina: labNum,
  hematocrito: percent,
  vcm: labNum,
  homocisteina: labNum,
  ferritina: labNum,
  hierro: labNum,
  cap_fij_tot_he: labNum,
  saturacion_hierro: percent,
})

export const perfilEndocrinoSchema = z.object({
  glucosa: labNum,
  hbAlc: percent,
  insulina: labNum,
  tiroxina_libre: labNum,
  triyodotironina: labNum,
})

export const perfilInflamatorioSchema = z.object({
  pcr: labNum,
  plaquetas: int({ max: 1000000 }),
})

export const perfilLipidosSchema = z.object({
  colesterol: labNum,
  c_hdl: labNum,
  c_ldl: labNum,
  trigliceridos: labNum,
})

export const perfilOrinaSchema = z.object({
  volumen_urinario: labNum,
  densidad: num({ max: 2000 }),
  alteraciones_urinarias: str(20),
  litos: str(50),
  ph: phScale,
  cetonas: str(50),
  sodio: int({ max: 32767 }),
})

export const perfilRenalElectrolitosSchema = z.object({
  osmolaridad: labNum,
  urea: labNum,
  bun: labNum,
  creatinina: labNum,
  acido_urico: labNum,
  sodio: labNum,
  peso_sin_edema: num({ max: 500 }),
  agua: percent,
  potasio: labNum,
  fosforo: labNum,
  calcio_serico: labNum,
  ca_corregido: labNum,
  producto_caP: labNum,
  pth: labNum,
  vitamina_d: labNum,
  tfge: labNum,
  albuminuria: labNum,
})

export const evalBioqNutricionSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia debe ser un UUID válido'),
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
  return evalBioqNutricionSchema.omit({ historia_paciente_id: true }).partial().safeParse(input)
}
