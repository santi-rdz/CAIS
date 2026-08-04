/**
 * @file Extiende el modelo cal_get_nutr con campos derivados — sin tabla de
 * resultados. Dos bloques:
 *
 * - Totales *obtenidos* (kcal, proteínas, carbohidratos, grasas), a partir de
 *   las cantidades de EQ guardadas.
 * - Objetivos *teóricos* de la fórmula rápida (`objetivos`), a partir del peso
 *   y los inputs de prescripción guardados. El balance (obtenido vs teórico)
 *   lo arma el frontend con ambos bloques.
 */

import { GRUPOS_EQUIVALENTES } from '@cais/shared/constants/nutricion'
import {
  calcularTotalesNutricionales,
  calcularObjetivosGET,
} from '@cais/shared/calculations/nutricion'

const eqNeeds = Object.fromEntries(GRUPOS_EQUIVALENTES.map((c) => [c, true]))

const objetivoNeeds = {
  peso: true,
  kcal_kg: true,
  proteina_g_kg: true,
  hc_porcentaje: true,
  lipidos_porcentaje: true,
}

export function withCalGetNutrTotales(prismaClient) {
  return prismaClient.$extends({
    name: 'calGetNutrTotales',
    result: {
      cal_get_nutr: {
        total_kcal: {
          needs: eqNeeds,
          compute: (record) => calcularTotalesNutricionales(record).kcal,
        },
        total_proteinas: {
          needs: eqNeeds,
          compute: (record) => calcularTotalesNutricionales(record).proteinas,
        },
        total_carbohidratos: {
          needs: eqNeeds,
          compute: (record) => calcularTotalesNutricionales(record).carbohidratos,
        },
        total_grasas: {
          needs: eqNeeds,
          compute: (record) => calcularTotalesNutricionales(record).grasas,
        },
        objetivos: {
          needs: objetivoNeeds,
          compute: (record) => calcularObjetivosGET(record),
        },
      },
    },
  })
}
