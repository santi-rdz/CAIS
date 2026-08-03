import {
  calcularTotalesNutricionales,
  calcularObjetivosGET,
} from '@cais/shared/calculations/nutricion'

describe('calcularTotalesNutricionales', () => {
  test('suma EQ × valor base por macronutriente', () => {
    const eq = {
      verdura: 4,
      fruta: 4,
      cereal_sin_grasa: 8,
      leguminosas: 2,
      aoa_c: 4,
      leche_b: 2,
      grasa_a: 6,
      azucares: 1,
    }
    expect(calcularTotalesNutricionales(eq)).toEqual({
      kcal: 1970,
      proteinas: 86,
      grasas: 60,
      carbohidratos: 270,
    })
  })

  test('sin cantidades devuelve ceros', () => {
    expect(calcularTotalesNutricionales({})).toEqual({
      kcal: 0,
      proteinas: 0,
      grasas: 0,
      carbohidratos: 0,
    })
  })

  test('tolera strings crudos del preview sin propagar NaN', () => {
    const totales = calcularTotalesNutricionales({ verdura: '', fruta: '-', cereal_sin_grasa: '2' })
    expect(totales.kcal).toBe(140)
    expect(Number.isNaN(totales.kcal)).toBe(false)
  })
})

describe('calcularObjetivosGET (fórmula rápida)', () => {
  test('GET = kcal/kg × peso; proteína por kg; HC y lípidos por % del GET', () => {
    const o = calcularObjetivosGET({
      peso: 70,
      kcal_kg: 30,
      proteina_g_kg: 1.2,
      hc_porcentaje: 55,
      lipidos_porcentaje: 30,
    })

    expect(o.get).toBe(2100)

    expect(o.proteinas.g).toBeCloseTo(84, 5)
    expect(o.proteinas.kcal).toBeCloseTo(336, 5)
    expect(o.proteinas.porcentaje).toBeCloseTo(16, 5)

    expect(o.carbohidratos.g).toBeCloseTo(288.75, 5)
    expect(o.carbohidratos.kcal).toBeCloseTo(1155, 5)
    expect(o.carbohidratos.porcentaje).toBeCloseTo(55, 5)

    expect(o.grasas.g).toBeCloseTo(70, 5)
    expect(o.grasas.kcal).toBeCloseTo(630, 5)
    expect(o.grasas.porcentaje).toBeCloseTo(30, 5)
  })

  test('peso 0 no produce NaN ni división por cero', () => {
    const o = calcularObjetivosGET({ peso: 0, kcal_kg: 30, hc_porcentaje: 55 })
    expect(o.get).toBe(0)
    expect(o.carbohidratos.g).toBe(0)
    expect(o.carbohidratos.porcentaje).toBe(0)
  })

  test('sin inputs devuelve objetivos en cero', () => {
    const o = calcularObjetivosGET()
    expect(o.get).toBe(0)
    expect(o.proteinas.g).toBe(0)
  })
})
