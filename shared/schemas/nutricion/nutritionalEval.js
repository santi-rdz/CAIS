import { z } from 'zod'
import { optionalDateSchema } from '../fields.js'

// eval_apetito_nutricion: VarChar(20) y TinyInt en DB
export const evalApetitoNutricionSchema = z.object({
  apetito: z.string().trim().max(20).nullish(),
  lleno: z.string().trim().max(20).nullish(),
  sabor_comida: z.string().trim().max(20).nullish(),
  comidas_al_dia: z.string().trim().max(20).nullish(),
  puntaje_total: z.number().int().nullish(),
  clasif_alteracion_apetito: z.string().trim().max(20).nullish(),
})

// frec_consumo_alimentos_nutricion: todos VarChar(20) salvo cdas_al_dia_sal_extra y cdas_sobres_al_dia_azucar (TinyInt)
export const frecConsumosAlimentosNutricionSchema = z.object({
  frutas: z.string().trim().max(20).nullish(),
  verduras_cocidas: z.string().trim().max(20).nullish(),
  verduras_crudas: z.string().trim().max(20).nullish(),
  pescado: z.string().trim().max(20).nullish(),
  mariscos: z.string().trim().max(20).nullish(),
  pollo: z.string().trim().max(20).nullish(),
  carne_roja: z.string().trim().max(20).nullish(),
  quesos: z.string().trim().max(20).nullish(),
  huevo_entero: z.string().trim().max(20).nullish(),
  clara_huevo: z.string().trim().max(20).nullish(),
  embutidos: z.string().trim().max(20).nullish(),
  leguminosas: z.string().trim().max(20).nullish(),
  tortilla_maiz: z.string().trim().max(20).nullish(),
  cant_tortilla_maiz: z.string().trim().max(20).nullish(),
  tortilla_harina: z.string().trim().max(20).nullish(),
  cant_tortilla_harina: z.string().trim().max(20).nullish(),
  pan_de_caja: z.string().trim().max(20).nullish(),
  galletas_industr: z.string().trim().max(20).nullish(),
  pan_dulce: z.string().trim().max(20).nullish(),
  cereal_de_caja: z.string().trim().max(20).nullish(),
  frituras_papas: z.string().trim().max(20).nullish(),
  birote_bolillo: z.string().trim().max(20).nullish(),
  pastas_arroz: z.string().trim().max(20).nullish(),
  aderezos_capsu: z.string().trim().max(20).nullish(),
  comida_rapida: z.string().trim().max(20).nullish(),
  grasa_animal: z.string().trim().max(20).nullish(),
  grasa_vegetal: z.string().trim().max(20).nullish(),
  cafe_te: z.string().trim().max(20).nullish(),
  litros_al_dia_cafe_te: z.string().trim().max(20).nullish(),
  bebida_az: z.string().trim().max(20).nullish(),
  litros_al_dia_beb_az: z.string().trim().max(20).nullish(),
  bebida_endul_art: z.string().trim().max(20).nullish(),
  litros_al_dia_beb_endul: z.string().trim().max(20).nullish(),
  leche_sin_az: z.string().trim().max(20).nullish(),
  litros_al_dia_leche_sin_az: z.string().trim().max(20).nullish(),
  agua_simple: z.string().trim().max(20).nullish(),
  litros_al_dia_agua_simple: z.string().trim().max(20).nullish(),
  agrega_sal_extra: z.string().trim().max(20).nullish(),
  cdas_al_dia_sal_extra: z.number().int().nullish(),
  agrega_azucar: z.string().trim().max(20).nullish(),
  cdas_sobres_al_dia_azucar: z.number().int().nullish(),
})

// horarios_comida_nutricion: VarChar(20) para horas, VarChar(10) para tipo_alimentacion, VarChar(255) para pensamientos
export const horariosComidaNutricionSchema = z.object({
  hora_desayuno: z.string().trim().max(20).nullish(),
  hora_comida: z.string().trim().max(20).nullish(),
  hora_cena: z.string().trim().max(20).nullish(),
  hora_colac_1: z.string().trim().max(20).nullish(),
  hora_colac_2: z.string().trim().max(20).nullish(),
  hora_colac_3: z.string().trim().max(20).nullish(),
  hora_despierto: z.string().trim().max(20).nullish(),
  tipo_alimentacion: z.string().trim().max(10).nullish(),
  problemas_masticar: z.boolean().nullish(),
  problemas_pasar_alimento: z.boolean().nullish(),
  perdida_dientes: z.boolean().nullish(),
  pensamientos_sobre_dieta: z.string().trim().max(255).nullish(),
})

export const nutritionalEvalBaseSchema = z.object({
  fecha: optionalDateSchema,
  sigue_dieta: z.boolean().nullish(),
  tiene_alergia: z.boolean().nullish(),
  cual_alergia: z.string().trim().nullish(),
  alimentos_disgusta: z.string().trim().nullish(),
})

export const nutritionalEvalSchema = z.object({
  paciente_id: z.uuid('El ID del paciente debe ser un UUID válido'),
  ...nutritionalEvalBaseSchema.shape,
  eval_apetito_nutricion: evalApetitoNutricionSchema.optional(),
  frec_consumo_alimentos_nutricion: frecConsumosAlimentosNutricionSchema.optional(),
  horarios_comida_nutricion: horariosComidaNutricionSchema.optional(),
})

export function validateNutritionalEval(input) {
  return nutritionalEvalSchema.safeParse(input)
}

export function validatePartialNutritionalEval(input) {
  return nutritionalEvalSchema.partial().safeParse(input)
}
