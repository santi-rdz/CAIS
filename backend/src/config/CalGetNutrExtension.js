/**
 * @file Extiende el modelo cal_get_nutr con campos "result" derivados
 * (calorías, proteínas, carbohidratos, grasas totales), calculados a partir
 * de las cantidades guardadas — sin necesidad de una tabla de resultados.
 *
 * Prisma Client Extensions (`$extends` con el componente `result`) permite
 * definir campos virtuales que se calculan al leer el registro, usando otros
 * campos ya presentes (`needs`). No se guardan en la DB, no se pueden usar en
 * `where`/`orderBy` (son post-proceso en JS, no columnas SQL) — pero para
 * mostrar totales en una pantalla eso no importa.
 *
 * Aplica este extend UNA VEZ sobre el PrismaClient base, en la misma
 * instancia que ya exportas desde #config/prisma.js.
 */

import { calcularTotalesNutricionales } from '#lib/nutritionalExchanges.js'

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
