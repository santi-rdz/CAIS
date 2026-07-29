/**
 * @file Extiende el modelo cal_get_nutr con campos "result" derivados
 * (calorías, proteínas, carbohidratos, grasas totales), calculados a partir
 * de las cantidades guardadas — sin necesidad de una tabla de resultados.
 */

import { calcularTotalesNutricionales } from '#lib/NutritionalExchanges.js'

const CAMPOS_EQUIVALENTES = [
  'verdura',
  'fruta',
  'cereal_sin_grasa',
  'cereal_con_grasa',
  'leguminosas',
  'aoa_a',
  'aoa_b',
  'aoa_c',
  'aoa_d',
  'leche_a',
  'leche_b',
  'leche_c',
  'grasa_a',
  'grasa_b',
  'azucares',
  'rice_dream',
  'silk',
  'soyactive',
  'almond_breeze',
  'aube_baja',
  'nan_one',
  'aube_alta',
]

export function withCalGetNutrTotales(prismaClient) {
  return prismaClient.$extends({
    name: 'calGetNutrTotales',
    result: {
      cal_get_nutr: {
        total_kcal: {
          needs: Object.fromEntries(CAMPOS_EQUIVALENTES.map((c) => [c, true])),
          compute(record) {
            return calcularTotalesNutricionales(record).kcal
          },
        },
        total_proteinas: {
          needs: Object.fromEntries(CAMPOS_EQUIVALENTES.map((c) => [c, true])),
          compute(record) {
            return calcularTotalesNutricionales(record).proteinas
          },
        },
        total_carbohidratos: {
          needs: Object.fromEntries(CAMPOS_EQUIVALENTES.map((c) => [c, true])),
          compute(record) {
            return calcularTotalesNutricionales(record).carbohidratos
          },
        },
        total_grasas: {
          needs: Object.fromEntries(CAMPOS_EQUIVALENTES.map((c) => [c, true])),
          compute(record) {
            return calcularTotalesNutricionales(record).grasas
          },
        },
      },
    },
  })
}
