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

// Construye las filas de adicciones para RecordTable (consistente con las
// demás tabs, que también usan tabla).
export function buildAdiccionesRows(a) {
  if (!a) return []
  return [
    adiccionRow('Tabaco', a.adicto_tabaco, a.tabaco_frecuencia, a.num_cigarros_d, 'cig/día'),
    adiccionRow('Alcohol', a.adicto_alcohol, a.alcohol_frecuencia, a.ml_ocasion, 'ml/ocasión'),
    adiccionRow('Drogas', a.adicto_droga, a.drogas_frecuencia, a.cual_droga),
    adiccionRow(
      'Medicamento controlado',
      a.adicto_med_contr,
      a.med_contr_frecuencia,
      a.cual_med_contr
    ),
  ]
}
