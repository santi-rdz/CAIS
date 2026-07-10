import { formatFecha } from '@lib/dateHelpers'

// ── Catálogos de selects — Step 1 (Identificación) ──────────────────────────

export const ESCOLARIDAD_OPTIONS = [
  'Analfabeta',
  'Sabe leer/escribir',
  'Primaria',
  'Secundaria',
  'Bachillerato',
  'Licenciatura',
  'Posgrado',
]

export const OCUPACION_NUTR_OPTIONS = [
  'Estudiante',
  'Hogar',
  'Pensionado/jubilado',
  'Empleado',
  'Comerciante',
  'Profesionista',
  'Desempleado',
  'Otro',
]

export const ESTADO_CIVIL_NUTR_OPTIONS = ['Casado(a)', 'Soltero(a)', 'Viudo(a)', 'Unión libre']

export const SALARIO_DIA_OPTIONS = ['0-1.0', '1.1-2.0', '2.1-3.0', '3.1-4.0', '>4.1']

// ── Step 2 — Historia Médica + Tratamiento Alternativo ───────────────────────

export const ENFERMEDAD_OPTIONS = [
  'Anemia',
  'Cáncer',
  'Cansancio',
  'Cefalea',
  'COVID',
  'Dolor de cabeza',
  'Mareos',
  'Fatiga',
  'DM1',
  'DM2',
  'DMG',
  'ECV/IAM',
  'Enf. Hepática',
  'EPOC',
  'ERC1-5',
  'ERC-diál.',
  'HAS',
  'Hipercoles.',
  'Hipertriglic.',
  'Hiperuricemia',
  'Litiasis renal',
  'Litiasis vesíc.',
  'OB-SO',
  'SOP',
  'Trasplante',
  'Úlcera péptica',
]

export const TRATAMIENTO_PRODUCTO_OPTIONS = [
  'Acupuntura',
  'Aromaterapia',
  'Biomagnetismo',
  'Curandero',
  'Gorgojoterapia',
  'Homeopatía',
  'Infusiones',
  'Licuados',
  'Medicina china',
  'Orinoterapia',
  'Plantas',
  'Reflexología',
  'Suple/Comp. Nutr',
]

export const MEJORA_OPTIONS = ['Mejor', 'Peor', 'Igual']

// ── Step 3 — Adicciones ──────────────────────────────────────────────────────

export const FRECUENCIA_OPTIONS = [
  'Nunca',
  'Rara vez',
  'Diario',
  'De 1 a 2/7',
  'De 3 a 4/7',
  'De 5 a 6/7',
]

// ── Step — Evaluación calidad del sueño ─────────────────────────────────────

export const CLASIF_HORAS_SUENO_OPTIONS = ['<3 horas', '3-5 horas', '6-8 horas', '>8 horas']
export const INSOMNIO_OPTIONS = ['SI', 'NO', 'RARA VEZ']
export const MEDICACION_SUENO_OPTIONS = ['SI', 'NO', 'RARA VEZ']

// ── Step — Evaluación actividad física ───────────────────────────────────────

export const TIPO_AF_OPTIONS = ['NINGUNO', 'AEROBIO', 'ANAEROBIO', 'MIXTO']
export const FRECUENCIA_AF_OPTIONS = ['3 días/s', '4 días/s', '5 días/s', 'Semanal', 'Mensual']
export const CLASIF_TIEMPO_AF_OPTIONS = ['<30 min', 'De 30-60 min', '>60 min']
export const TIEMPO_PRACTICA_OPTIONS = ['Menos de 6 meses', 'Más de 6 meses']
export const PENSAMIENTOS_AF_OPTIONS = [
  'No lo he pensado',
  'Estoy pensando en hacerlo',
  'Planeo iniciar en los próximos 6 m',
  'Empecé hace 6 m',
  'Lo hago de manera regular',
]

// ── Step — Evaluación bioquímica: Perfil de Orina ───────────────────────────

export const ALTERACIONES_URINARIAS_OPTIONS = ['Negativo', 'IVU', 'Hematuria']
export const LITOS_OPTIONS = [
  'Negativo',
  'AU <600',
  'AU <800',
  'Oxalato <40',
  'Citrato >350',
  'Fitato >1.0',
  'Cistina <150',
  'Mixto',
]
export const CETONAS_OPTIONS = ['Negativo', 'Cetona +', 'Cetona ++', 'Cetona +++']

// ── Visualización de la historia nutricional ─────────────────────────────────

// Columnas de las tablas de relaciones one-to-many (reutilizadas por RecordTable).
export const ENFERMEDAD_COLUMNS = [
  { key: 'enfermedad', label: 'Enfermedad' },
  { key: 'evol', label: 'Evol. (años)' },
  { key: 'farmacos', label: 'Fármacos' },
  { key: 'dosis', label: 'Dosis' },
]

export const TRATAMIENTO_COLUMNS = [
  { key: 'producto', label: 'Producto' },
  { key: 'cual_producto', label: '¿Cuál?' },
  { key: 'mejora', label: 'Mejoró' },
  { key: 'dosis', label: 'Dosis' },
]

export const SUENO_COLUMNS = [
  { key: 'fecha', label: 'Fecha', format: formatFecha },
  { key: 'horas_sueno', label: 'Horas sueño' },
  { key: 'clasif_horas_sueno', label: 'Clasif. Hrs sueño' },
  { key: 'insomnio', label: 'Insomnio' },
  { key: 'medicacion', label: 'Med. para dormir' },
]

export const ACT_FISICA_COLUMNS = [
  { key: 'fecha', label: 'Fecha', format: formatFecha },
  { key: 'tipo', label: 'Tipo AF' },
  { key: 'porque_no', label: '¿Por qué NO?' },
  { key: 'frecuencia', label: 'Frecuencia' },
  { key: 'duracion', label: 'Duración (min)' },
  { key: 'clasif_tiempo_af', label: 'Clasif. Tiempo AF' },
  { key: 'intensidad', label: 'Intensidad (%)' },
  { key: 'tiempo_de_practica', label: 'Tiempo práctica' },
  { key: 'pensamientos_con_realizar_AF', label: '¿Qué ha pensado?' },
]

// Mapea cada sub-perfil de eval_bioq_nutricion a su label corto — usado por
// BioqCard para mostrar qué perfiles capturó la evaluación.
export const BIOQ_PROFILE_LABELS = [
  { key: 'perfil_anemia_nutricion', label: 'Anemia' },
  { key: 'perfil_endocrino', label: 'Endócrino' },
  { key: 'perfil_renal_electrolitos', label: 'Renal' },
  { key: 'perfil_lipidos', label: 'Lípidos' },
  { key: 'balance_acido_base', label: 'Ácido-Base' },
  { key: 'perfil_orina', label: 'Orina' },
  { key: 'perfil_inflamatorio', label: 'Inflamatorio' },
  { key: 'eval_estado_nutricion', label: 'Nutrición' },
]

export const ADICCIONES_COLUMNS = [
  { key: 'sustancia', label: 'Sustancia' },
  { key: 'consume', label: 'Consume' },
  { key: 'frecuencia', label: 'Frecuencia' },
  { key: 'detalle', label: 'Cantidad / Detalle' },
]

// Construye una fila de la tabla de adicciones; campos vacíos quedan null (—).
function adiccionRow(sustancia, activo, frecuencia, metrica, unidad) {
  const consume = activo === 'si'
  const tieneMetrica = metrica != null && metrica !== ''
  return {
    sustancia,
    consume: consume ? 'Sí' : 'No',
    frecuencia: consume ? frecuencia : null,
    detalle: consume && tieneMetrica ? (unidad ? `${metrica} ${unidad}` : metrica) : null,
  }
}

// Construye las filas de adicciones para RecordTable. Es un catálogo fijo (4
// sustancias), así que siempre se muestran las 4 — sin registro = todas en "No",
// nunca un empty state (consistente con los chips de servicios de medicina).
export function buildAdiccionesRows(a = {}) {
  const adic = a ?? {}
  return [
    adiccionRow(
      'Tabaco',
      adic.adicto_tabaco,
      adic.tabaco_frecuencia,
      adic.num_cigarros_d,
      'cig/día'
    ),
    adiccionRow(
      'Alcohol',
      adic.adicto_alcohol,
      adic.alcohol_frecuencia,
      adic.ml_ocasion,
      'ml/ocasión'
    ),
    adiccionRow('Drogas', adic.adicto_droga, adic.drogas_frecuencia, adic.cual_droga),
    adiccionRow(
      'Medicamento controlado',
      adic.adicto_med_contr,
      adic.med_contr_frecuencia,
      adic.cual_med_contr
    ),
  ]
}

// ── Evaluación Nutricional (Frecuencia y Hábitos) ────────────────────────────

// Step 1 — Problemas de alimentación / pensamientos sobre dieta.
export const TIPO_ALIMENTACION_OPTIONS = ['Oral', 'Sonda']
export const PENSAMIENTOS_DIETA_OPTIONS = [
  'No lo he pensado',
  'Estoy pensando en hacerlo',
  'Planeo iniciar en los próximos 6 m',
  'Empecé hace 6 m',
  'Lo hago de manera regular',
]

// Step 2 — Evaluación de apetito. Cada opción lleva sus puntos: se guarda el
// `value` corto (cabe en VARCHAR(20)) y se muestra el `label`; el puntaje y la
// clasificación se derivan de los puntos (no los captura el usuario).
export const APETITO_OPTIONS = [
  { value: 'muy_escaso', label: 'Muy escaso', points: 1 },
  { value: 'escaso', label: 'Escaso', points: 2 },
  { value: 'regular', label: 'Regular', points: 3 },
  { value: 'bueno', label: 'Bueno', points: 4 },
  { value: 'muy_bueno', label: 'Muy bueno', points: 5 },
]
export const SACIEDAD_OPTIONS = [
  { value: 'poco_bocado', label: 'Al comer poco bocado', points: 1 },
  { value: 'un_tercio', label: 'Al comer 1/3 del plato', points: 2 },
  { value: 'medio_plato', label: 'Al comer >1/2 plato', points: 3 },
  { value: 'mayor_parte', label: 'Al comer la mayor parte', points: 4 },
  { value: 'casi_nunca', label: 'Casi nunca me siento lleno', points: 5 },
]
export const SABOR_COMIDA_OPTIONS = [
  { value: 'muy_mala', label: 'Muy mala', points: 1 },
  { value: 'mala', label: 'Mala', points: 2 },
  { value: 'regular', label: 'Regular', points: 3 },
  { value: 'buena', label: 'Buena', points: 4 },
  { value: 'muy_buena', label: 'Muy buena', points: 5 },
]
export const COMIDAS_DIA_OPTIONS = [
  { value: 'menos_1', label: '<1 comida/día', points: 1 },
  { value: 'una', label: '1 comida/día', points: 2 },
  { value: 'dos', label: '2 comidas/día', points: 3 },
  { value: 'tres', label: '3 comidas/día', points: 4 },
  { value: 'mas_3', label: '>3 comidas/día', points: 5 },
]

// Config declarativa de los 4 selects puntuados (nombre de campo DB → opciones).
export const APETITO_SCORE_FIELDS = [
  { name: 'apetito', label: 'Apetito', options: APETITO_OPTIONS },
  { name: 'lleno', label: 'Sensación de saciedad', options: SACIEDAD_OPTIONS },
  { name: 'sabor_comida', label: 'Sabor de los alimentos', options: SABOR_COMIDA_OPTIONS },
  { name: 'comidas_al_dia', label: 'Comidas por día', options: COMIDAS_DIA_OPTIONS },
]

export const APETITO_UMBRAL = 14
export const CLASIF_SIN_RIESGO = 'Sin riesgo'
export const CLASIF_RIESGO = 'Riesgo significativo'

// Lookup value → label para la vista de detalle (los 4 selects puntuados).
export const APETITO_VALUE_LABELS = Object.fromEntries(
  APETITO_SCORE_FIELDS.flatMap((f) => f.options.map((o) => [o.value, o.label]))
)

// Puntos máximos posibles (4 selects × 5 pts) — para mostrar "n / 20".
export const APETITO_PUNTAJE_MAX = APETITO_SCORE_FIELDS.length * 5

// Devuelve la opción { value, label, points } elegida en un campo puntuado.
export function getApetitoOption(name, value) {
  const field = APETITO_SCORE_FIELDS.find((f) => f.name === name)
  return field?.options.find((o) => o.value === value) ?? null
}

// Suma los puntos de los selects contestados y clasifica el riesgo. La
// clasificación solo aplica con los 4 campos contestados: comparar un puntaje
// parcial contra el umbral de escala completa marcaría "Riesgo significativo"
// de forma engañosa. `clasif` es null hasta completar; `hasValues` (≥1 campo)
// permite al form decidir si incluir el bloque de apetito en el payload.
export function computeApetitoScore(apetito) {
  let puntaje = 0
  let contestados = 0
  for (const { name, options } of APETITO_SCORE_FIELDS) {
    const opt = options.find((o) => o.value === apetito?.[name])
    if (opt) {
      puntaje += opt.points
      contestados++
    }
  }
  const completo = contestados === APETITO_SCORE_FIELDS.length
  return {
    puntaje,
    clasif: completo ? (puntaje >= APETITO_UMBRAL ? CLASIF_SIN_RIESGO : CLASIF_RIESGO) : null,
    hasValues: contestados > 0,
  }
}

// Step 3 — Frecuencia de consumo y líquidos.
export const FRECUENCIA_CONSUMO_OPTIONS = [
  'Nunca',
  '1 vez/mes',
  'Cada 15 día',
  '1-2 v/sem',
  '3-5 v/sem',
  'Diario',
  '>2 v/día',
]
export const CANTIDAD_LIQUIDOS_OPTIONS = [
  '<0.5 L/día',
  '0.5-1.0 L/día',
  '1.1-1.5 L/día',
  '1.6-2.0 L/día',
  '>2.0 L/día',
]
export const AZUCAR_TIPO_OPTIONS = [
  'Nunca',
  'Varios',
  'Miel',
  'Sacarosa',
  'Stevia',
  'Sucralosa',
  'Acesulfame K',
]
