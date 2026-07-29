/**
 * @file Valores nutricionales por unidad de intercambio (grupos de
 * alimentos), proporcionados por el equipo de nutrición.
 *
 * Estos NO son datos de paciente: son constantes fijas de referencia
 * nutricional, iguales para todos los cálculos. Por eso viven en código, no
 * en una tabla — así se calculan los totales sin duplicar información
 * derivada en la DB.
 *
 * Columnas de la tabla de referencia: Energía (kcal), Ps = proteínas (g),
 * Ls = lípidos/grasas (g), HC = hidratos de carbono (g). Todo por 1 EQ
 * (equivalente/unidad de intercambio) del grupo.
 */

// { kcal, proteinas, grasas, carbohidratos } por 1 unidad de intercambio
export const EQUIVALENTES_NUTRICIONALES = {
  verdura: { kcal: 25, proteinas: 2.0, grasas: 0.0, carbohidratos: 4.0 },
  fruta: { kcal: 60, proteinas: 0.0, grasas: 0.0, carbohidratos: 15.0 },
  cereal_sin_grasa: { kcal: 70, proteinas: 2.0, grasas: 0.0, carbohidratos: 15.0 },
  cereal_con_grasa: { kcal: 115, proteinas: 2.0, grasas: 5.0, carbohidratos: 15.0 },
  leguminosas: { kcal: 120, proteinas: 8.0, grasas: 1.0, carbohidratos: 20.0 },
  aoa_a: { kcal: 40, proteinas: 7.0, grasas: 1.0, carbohidratos: 0.0 },
  aoa_b: { kcal: 55, proteinas: 7.0, grasas: 3.0, carbohidratos: 0.0 },
  aoa_c: { kcal: 75, proteinas: 7.0, grasas: 5.0, carbohidratos: 0.0 },
  aoa_d: { kcal: 100, proteinas: 7.0, grasas: 7.0, carbohidratos: 0.0 },
  leche_a: { kcal: 95, proteinas: 9.0, grasas: 2.0, carbohidratos: 12.0 },
  leche_b: { kcal: 110, proteinas: 9.0, grasas: 4.0, carbohidratos: 12.0 },
  leche_c: { kcal: 150, proteinas: 9.0, grasas: 8.0, carbohidratos: 12.0 },
  grasa_a: { kcal: 45, proteinas: 0.0, grasas: 5.0, carbohidratos: 0.0 },
  grasa_b: { kcal: 70, proteinas: 3.0, grasas: 5.0, carbohidratos: 0.0 },
  azucares: { kcal: 40, proteinas: 0.0, grasas: 0.0, carbohidratos: 10.0 },
  // Rice Dream (240 ml, baja proteína)
  rice_dream: { kcal: 120, proteinas: 1.0, grasas: 2.5, carbohidratos: 23.0 },
  // Silk — leche de soya (240 ml, 3 cdas)
  silk: { kcal: 100, proteinas: 7.0, grasas: 0.0, carbohidratos: 6.0 },
  // Soyactive — leche de soya (240 ml, 3 cdas)
  soyactive: { kcal: 110, proteinas: 5.0, grasas: 0.0, carbohidratos: 11.0 },
  // Almond Breeze Original (240 ml)
  almond_breeze: { kcal: 60, proteinas: 1.0, grasas: 0.0, carbohidratos: 7.0 },
  // Aube (240 ml, baja en proteína)
  aube_baja: { kcal: 98, proteinas: 2.4, grasas: 5.0, carbohidratos: 10.8 },
  // NAN 1 (240 ml, baja en proteína)
  nan_one: { kcal: 176, proteinas: 3.2, grasas: 10.0, carbohidratos: 20.0 },
  // Aube (240 ml, alta en proteína)
  aube_alta: { kcal: 91, proteinas: 7.5, grasas: 4.2, carbohidratos: 5.9 },
}

/**
 * Calcula los totales (kcal, proteínas, grasas, carbohidratos) a partir de
 * las cantidades guardadas en un registro de cal_get_nutr.
 *
 * @param {Record<string, number|null>} cantidades - el registro de
 *   cal_get_nutr (o un subconjunto con las mismas llaves que
 *   EQUIVALENTES_NUTRICIONALES).
 */
export function calcularTotalesNutricionales(cantidades) {
  const totales = { kcal: 0, proteinas: 0, grasas: 0, carbohidratos: 0 }

  for (const [grupo, valores] of Object.entries(EQUIVALENTES_NUTRICIONALES)) {
    const cantidad = cantidades?.[grupo] ?? 0
    totales.kcal += cantidad * valores.kcal
    totales.proteinas += cantidad * valores.proteinas
    totales.grasas += cantidad * valores.grasas
    totales.carbohidratos += cantidad * valores.carbohidratos
  }

  return totales
}
