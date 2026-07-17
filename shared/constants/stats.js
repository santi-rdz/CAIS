// Rangos de tiempo para las estadísticas. Cruzan FE↔BE: el FE los ofrece en el
// select y el BE valida el query param `range` de GET /stats.
export const STATS_RANGES = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
}

export const DEFAULT_STATS_RANGE = STATS_RANGES.WEEK

// Tamaño de la ventana de tiempo por rango — fuente única: el backend la usa para
// acotar las queries y los captions derivan de aquí (evita que se desincronicen).
export const STATS_RANGE_WINDOW = {
  [STATS_RANGES.WEEK]: { days: 7 },
  [STATS_RANGES.MONTH]: { days: 30 },
  [STATS_RANGES.YEAR]: { months: 12 },
}

// Etiqueta del select.
export const STATS_RANGE_LABELS = {
  [STATS_RANGES.WEEK]: 'Semanal',
  [STATS_RANGES.MONTH]: 'Mensual',
  [STATS_RANGES.YEAR]: 'Anual',
}

// Ayuda visual: qué ventana de tiempo cubre un dato afectado por el rango.
export const STATS_RANGE_CAPTIONS = {
  [STATS_RANGES.WEEK]: `Últimos ${STATS_RANGE_WINDOW[STATS_RANGES.WEEK].days} días`,
  [STATS_RANGES.MONTH]: `Últimos ${STATS_RANGE_WINDOW[STATS_RANGES.MONTH].days} días`,
  [STATS_RANGES.YEAR]: `Últimos ${STATS_RANGE_WINDOW[STATS_RANGES.YEAR].months} meses`,
}
