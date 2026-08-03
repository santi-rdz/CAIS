// Metadatos de UI del cálculo de GET nutricional. Los valores base por EQ y el
// cómputo de totales/objetivos viven en @cais/shared/calculations/nutricion; aquí
// solo las etiquetas y el agrupado visual, propios del frontend.

// Inputs de la fórmula rápida (Paso 1). La proteína se prescribe por kg; HC y
// lípidos como % del GET; kcal/kg define el GET total.
export const GET_INPUT_FIELDS = [
  { name: 'peso', label: 'Peso (kg)', step: '0.1' },
  { name: 'estatura', label: 'Estatura (cm)', step: '0.1' },
  { name: 'kcal_kg', label: 'Energía (kcal/kg)', step: '0.1' },
  { name: 'proteina_g_kg', label: 'Proteína (g/kg)', step: '0.1' },
  { name: 'hc_porcentaje', label: 'Hidratos de carbono (%)', step: '1' },
  { name: 'lipidos_porcentaje', label: 'Lípidos (%)', step: '1' },
]

export const EQUIVALENTE_LABELS = {
  verdura: 'Verdura',
  fruta: 'Fruta',
  cereal_sin_grasa: 'Cereal sin grasa',
  cereal_con_grasa: 'Cereal con grasa',
  leguminosas: 'Leguminosas',
  aoa_a: 'AOA muy bajo en grasa (A)',
  aoa_b: 'AOA bajo en grasa (B)',
  aoa_c: 'AOA moderado en grasa (C)',
  aoa_d: 'AOA alto en grasa (D)',
  leche_a: 'Leche descremada (A)',
  leche_b: 'Leche semidescremada (B)',
  leche_c: 'Leche entera (C)',
  grasa_a: 'Grasa sin proteína (A)',
  grasa_b: 'Grasa con proteína (B)',
  azucares: 'Azúcares',
  rice_dream: 'Rice Dream (240 ml)',
  silk: 'Silk soya (240 ml)',
  soyactive: 'Soyactive (240 ml)',
  almond_breeze: 'Almond Breeze (240 ml)',
  aube_baja: 'Aube baja en proteína (240 ml)',
  nan_one: 'NAN 1 (240 ml)',
  aube_alta: 'Aube alta en proteína (240 ml)',
}

// Los 22 grupos agrupados en secciones para no listar un scroll plano.
export const EQUIVALENTE_SECTIONS = [
  {
    title: 'Verduras, frutas y cereales',
    grupos: ['verdura', 'fruta', 'cereal_sin_grasa', 'cereal_con_grasa', 'leguminosas'],
  },
  {
    title: 'Alimentos de origen animal (AOA)',
    grupos: ['aoa_a', 'aoa_b', 'aoa_c', 'aoa_d'],
  },
  {
    title: 'Leche',
    grupos: ['leche_a', 'leche_b', 'leche_c'],
  },
  {
    title: 'Grasas y azúcares',
    grupos: ['grasa_a', 'grasa_b', 'azucares'],
  },
  {
    title: 'Fórmulas y leches especiales',
    grupos: [
      'rice_dream',
      'silk',
      'soyactive',
      'almond_breeze',
      'aube_baja',
      'nan_one',
      'aube_alta',
    ],
  },
]

// Filas del panel Obtenido vs Teórico. `obtenido` indexa los totales de EQ;
// `objetivo` indexa el resultado de calcularObjetivosGET (get es escalar, el
// resto trae { g }).
export const BALANCE_ROWS = [
  { label: 'Energía', unit: 'kcal', obtenido: 'kcal', objetivo: 'get' },
  { label: 'Proteínas', unit: 'g', obtenido: 'proteinas', objetivo: 'proteinas' },
  { label: 'Lípidos', unit: 'g', obtenido: 'grasas', objetivo: 'grasas' },
  { label: 'Hidratos de carbono', unit: 'g', obtenido: 'carbohidratos', objetivo: 'carbohidratos' },
]
