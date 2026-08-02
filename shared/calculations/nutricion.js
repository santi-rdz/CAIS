/**
 * @file Fórmulas del cálculo de GET nutricional — centralizadas y compartidas
 * entre backend (deriva los totales guardados) y frontend (previsualiza en
 * vivo). Los datos de referencia (valores por EQ, factores de Atwater) viven
 * en `../constants/nutricion.js`; aquí solo la aritmética.
 */

import { EQUIVALENTES_NUTRICIONALES, KCAL_POR_GRAMO } from '../constants/nutricion.js'

/**
 * Totales obtenidos (kcal, proteínas, grasas, carbohidratos) a partir de las
 * cantidades de EQ guardadas en un registro de cal_get_nutr.
 *
 * @param {Record<string, number|null>} cantidades - registro con las mismas
 *   llaves que EQUIVALENTES_NUTRICIONALES.
 */
export function calcularTotalesNutricionales(cantidades) {
  const totales = { kcal: 0, proteinas: 0, grasas: 0, carbohidratos: 0 }

  for (const [grupo, valores] of Object.entries(EQUIVALENTES_NUTRICIONALES)) {
    // Number()||0 (no solo `?? 0`): el preview del frontend pasa strings crudos
    // de RHF; tolera '' y valores a medio escribir sin propagar NaN.
    const cantidad = Number(cantidades?.[grupo]) || 0
    totales.kcal += cantidad * valores.kcal
    totales.proteinas += cantidad * valores.proteinas
    totales.grasas += cantidad * valores.grasas
    totales.carbohidratos += cantidad * valores.carbohidratos
  }

  return totales
}

/**
 * Objetivos teóricos de la fórmula rápida a partir del peso y los inputs de
 * prescripción. La proteína se fija por kg de peso; HC y lípidos por % del
 * GET; el GET total por kcal/kg de peso.
 *
 * @param {object} inputs
 * @param {number|null} inputs.peso - kg
 * @param {number|null} inputs.kcal_kg - kcal por kg (define el GET)
 * @param {number|null} inputs.proteina_g_kg - g de proteína por kg
 * @param {number|null} inputs.hc_porcentaje - % del GET en HC
 * @param {number|null} inputs.lipidos_porcentaje - % del GET en lípidos
 */
export function calcularObjetivosGET({
  peso,
  kcal_kg,
  proteina_g_kg,
  hc_porcentaje,
  lipidos_porcentaje,
} = {}) {
  const p = Number(peso) || 0
  const get = (Number(kcal_kg) || 0) * p

  const proteinas_g = (Number(proteina_g_kg) || 0) * p
  const proteinas_kcal = proteinas_g * KCAL_POR_GRAMO.proteinas

  const carbohidratos_kcal = ((Number(hc_porcentaje) || 0) * get) / 100
  const carbohidratos_g = carbohidratos_kcal / KCAL_POR_GRAMO.carbohidratos

  const grasas_kcal = ((Number(lipidos_porcentaje) || 0) * get) / 100
  const grasas_g = grasas_kcal / KCAL_POR_GRAMO.grasas

  const pct = (kcal) => (get > 0 ? (kcal * 100) / get : 0)

  return {
    get,
    proteinas: { g: proteinas_g, kcal: proteinas_kcal, porcentaje: pct(proteinas_kcal) },
    carbohidratos: {
      g: carbohidratos_g,
      kcal: carbohidratos_kcal,
      porcentaje: pct(carbohidratos_kcal),
    },
    grasas: { g: grasas_g, kcal: grasas_kcal, porcentaje: pct(grasas_kcal) },
  }
}
