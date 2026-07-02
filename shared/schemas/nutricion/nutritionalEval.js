import { z } from 'zod'
import { optionalDateSchema, int, str, text } from '../fields.js'

const tinyIntSchema = int({ max: 127 })

// eval_apetito_nutricion: VarChar(20) y TinyInt en DB
export const evalApetitoNutricionSchema = z.object({
  apetito: str(20),
  lleno: str(20),
  sabor_comida: str(20),
  comidas_al_dia: str(20),
  puntaje_total: tinyIntSchema.nullish(),
  clasif_alteracion_apetito: str(20),
})

// frec_consumo_alimentos_nutricion: todos VarChar(20) salvo cdas_al_dia_sal_extra y cdas_sobres_al_dia_azucar (TinyInt)
export const frecConsumosAlimentosNutricionSchema = z.object({
  frutas: str(20),
  verduras_cocidas: str(20),
  verduras_crudas: str(20),
  pescado: str(20),
  mariscos: str(20),
  pollo: str(20),
  carne_roja: str(20),
  quesos: str(20),
  huevo_entero: str(20),
  clara_huevo: str(20),
  embutidos: str(20),
  leguminosas: str(20),
  tortilla_maiz: str(20),
  cant_tortilla_maiz: str(20),
  tortilla_harina: str(20),
  cant_tortilla_harina: str(20),
  pan_de_caja: str(20),
  galletas_industr: str(20),
  pan_dulce: str(20),
  cereal_de_caja: str(20),
  frituras_papas: str(20),
  birote_bolillo: str(20),
  pastas_arroz: str(20),
  aderezos_capsu: str(20),
  comida_rapida: str(20),
  grasa_animal: str(20),
  grasa_vegetal: str(20),
  cafe_te: str(20),
  litros_al_dia_cafe_te: str(20),
  bebida_az: str(20),
  litros_al_dia_beb_az: str(20),
  bebida_endul_art: str(20),
  litros_al_dia_beb_endul: str(20),
  leche_sin_az: str(20),
  litros_al_dia_leche_sin_az: str(20),
  agua_simple: str(20),
  litros_al_dia_agua_simple: str(20),
  agrega_sal_extra: str(20),
  cdas_al_dia_sal_extra: tinyIntSchema.nullish(),
  agrega_azucar: str(20),
  cdas_sobres_al_dia_azucar: tinyIntSchema.nullish(),
})

// horarios_comida_nutricion: horas/tipo son VarChar; pensamientos es narrativo.
export const horariosComidaNutricionSchema = z.object({
  hora_desayuno: str(20),
  hora_comida: str(20),
  hora_cena: str(20),
  hora_colac_1: str(20),
  hora_colac_2: str(20),
  hora_colac_3: str(20),
  hora_despierto: str(20),
  tipo_alimentacion: str(10),
  problemas_masticar: z.boolean().nullish(),
  problemas_pasar_alimento: z.boolean().nullish(),
  perdida_dientes: z.boolean().nullish(),
  pensamientos_sobre_dieta: text(),
})

export const nutritionalEvalBaseSchema = z.object({
  fecha: optionalDateSchema,
  sigue_dieta: z.boolean().nullish(),
  tiene_alergia: z.boolean().nullish(),
  cual_alergia: text(),
  alimentos_disgusta: text(),
})

export const nutritionalEvalSchema = z.object({
  historia_paciente_id: z.uuid('El ID de la historia debe ser un UUID válido'),
  ...nutritionalEvalBaseSchema.shape,
  eval_apetito_nutricion: evalApetitoNutricionSchema.optional(),
  frec_consumo_alimentos_nutricion: frecConsumosAlimentosNutricionSchema.optional(),
  horarios_comida_nutricion: horariosComidaNutricionSchema.optional(),
})

export function validateNutritionalEval(input) {
  return nutritionalEvalSchema.safeParse(input)
}

export function validatePartialNutritionalEval(input) {
  return nutritionalEvalSchema.omit({ historia_paciente_id: true }).partial().safeParse(input)
}
