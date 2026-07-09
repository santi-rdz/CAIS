// Config declarativa del step de Frecuencia de Consumo: una sola fuente de
// verdad de qué campos tiene cada grupo, su label y su tipo de control. La usan
// el step del form (FrecuenciaConsumoStep) y la vista de detalle (NutrDetail).
//
// type:
//   'frecuencia' → select de FRECUENCIA_CONSUMO_OPTIONS (Nunca … >2 v/día)
//   'cantidad'   → select de CANTIDAD_LIQUIDOS_OPTIONS (litros/día)
//   'azucar'     → select de AZUCAR_TIPO_OPTIONS (tipo de endulzante)
//   'piezas'     → texto libre (No. de piezas que consume)
//   'numero'     → entero (cucharadas/día)

export const FRECUENCIA_GROUPS = [
  {
    id: 'frec-frutas',
    title: 'Frutas y Verduras',
    fields: [
      { name: 'frutas', label: 'Frutas', type: 'frecuencia' },
      { name: 'verduras_cocidas', label: 'Verduras cocidas', type: 'frecuencia' },
      { name: 'verduras_crudas', label: 'Verduras crudas', type: 'frecuencia' },
    ],
  },
  {
    id: 'frec-proteinas',
    title: 'Proteínas',
    fields: [
      { name: 'pescado', label: 'Pescado', type: 'frecuencia' },
      { name: 'mariscos', label: 'Mariscos', type: 'frecuencia' },
      { name: 'pollo', label: 'Pollo', type: 'frecuencia' },
      { name: 'carne_roja', label: 'Carne roja', type: 'frecuencia' },
      { name: 'huevo_entero', label: 'Huevo entero', type: 'frecuencia' },
      { name: 'clara_huevo', label: 'Claras de huevo', type: 'frecuencia' },
      { name: 'leguminosas', label: 'Leguminosas', type: 'frecuencia' },
    ],
  },
  {
    id: 'frec-lacteos',
    title: 'Lácteos y Embutidos',
    fields: [
      { name: 'quesos', label: 'Queso', type: 'frecuencia' },
      { name: 'embutidos', label: 'Embutidos', type: 'frecuencia' },
    ],
  },
  {
    id: 'frec-carbohidratos',
    title: 'Carbohidratos',
    fields: [
      { name: 'tortilla_maiz', label: 'Tortilla de maíz', type: 'frecuencia' },
      { name: 'cant_tortilla_maiz', label: 'No. de piezas (maíz)', type: 'piezas' },
      { name: 'tortilla_harina', label: 'Tortilla de harina', type: 'frecuencia' },
      { name: 'cant_tortilla_harina', label: 'No. de piezas (harina)', type: 'piezas' },
      { name: 'pan_de_caja', label: 'Pan de caja', type: 'frecuencia' },
      { name: 'birote_bolillo', label: 'Birote/Bolillo', type: 'frecuencia' },
      { name: 'pastas_arroz', label: 'Pasta/Arroz', type: 'frecuencia' },
    ],
  },
  {
    id: 'frec-procesados',
    title: 'Alimentos Procesados',
    fields: [
      { name: 'galletas_industr', label: 'Galletas industriales', type: 'frecuencia' },
      { name: 'pan_dulce', label: 'Pan dulce', type: 'frecuencia' },
      { name: 'cereal_de_caja', label: 'Cereal de caja', type: 'frecuencia' },
      { name: 'frituras_papas', label: 'Frituras/Botanas', type: 'frecuencia' },
      { name: 'comida_rapida', label: 'Comida rápida', type: 'frecuencia' },
    ],
  },
  {
    id: 'frec-grasas',
    title: 'Grasas y Condimentos',
    fields: [
      { name: 'grasa_animal', label: 'Grasa animal', type: 'frecuencia' },
      { name: 'grasa_vegetal', label: 'Grasa vegetal', type: 'frecuencia' },
      { name: 'aderezos_capsu', label: 'Aderezos/Salsas', type: 'frecuencia' },
    ],
  },
  {
    id: 'frec-liquidos',
    title: 'Consumo de Líquidos',
    fields: [
      { name: 'cafe_te', label: 'Café/Té', type: 'frecuencia' },
      { name: 'litros_al_dia_cafe_te', label: 'Café/Té — litros/día', type: 'cantidad' },
      { name: 'bebida_az', label: 'Refrescos azucarados', type: 'frecuencia' },
      { name: 'litros_al_dia_beb_az', label: 'Refrescos — litros/día', type: 'cantidad' },
      { name: 'bebida_endul_art', label: 'Bebidas endulzadas (art.)', type: 'frecuencia' },
      { name: 'litros_al_dia_beb_endul', label: 'Bebidas endulz. — litros/día', type: 'cantidad' },
      { name: 'leche_sin_az', label: 'Leche (sin azúcar)', type: 'frecuencia' },
      { name: 'litros_al_dia_leche_sin_az', label: 'Leche — litros/día', type: 'cantidad' },
      { name: 'agua_simple', label: 'Agua natural', type: 'frecuencia' },
      { name: 'litros_al_dia_agua_simple', label: 'Agua — litros/día', type: 'cantidad' },
    ],
  },
  {
    id: 'frec-adiciones',
    title: 'Adiciones',
    fields: [
      { name: 'agrega_azucar', label: 'Tipo de endulzante', type: 'azucar' },
      {
        name: 'cdas_sobres_al_dia_azucar',
        label: 'Azúcar (cucharadas/sobres al día)',
        type: 'numero',
      },
      { name: 'cdas_al_dia_sal_extra', label: 'Sal extra (cucharadas al día)', type: 'numero' },
    ],
  },
]

// Nombres de todos los campos de frec_consumo capturados por el form — usado
// para derivar defaults y para decidir si el bloque va en el payload.
export const FRECUENCIA_FIELD_NAMES = FRECUENCIA_GROUPS.flatMap((g) => g.fields.map((f) => f.name))

// Campos de horarios_comida capturados en el step 1 (sin hora_despierto, que el
// mockup no muestra).
export const HORARIO_TIME_FIELDS = [
  { name: 'hora_desayuno', label: 'Desayuno' },
  { name: 'hora_comida', label: 'Comida' },
  { name: 'hora_cena', label: 'Cena' },
  { name: 'hora_colac_1', label: 'Colación 1' },
  { name: 'hora_colac_2', label: 'Colación 2' },
  { name: 'hora_colac_3', label: 'Colación 3' },
]

export const HORARIO_BOOL_FIELDS = [
  { name: 'problemas_masticar', label: 'Problemas para masticar' },
  { name: 'problemas_pasar_alimento', label: 'Dificultad para tragar alimentos' },
  { name: 'perdida_dientes', label: 'Pérdida de dientes' },
]
