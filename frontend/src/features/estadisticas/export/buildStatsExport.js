import dayjs from 'dayjs'
import { AREA_LABELS } from '@cais/shared/constants/users'
import {
  GENDER_LABELS,
  AGE_LABELS,
  PROCEDENCIA_LABELS,
} from '@features/dashboard/distributionConfig'

// Etiquetas de los counts (mismas que las cards del dashboard). `usuarios_conectados`
// se omite a propósito: es un dato en vivo, no tiene sentido en un reporte.
const COUNT_LABELS = {
  pacientes: 'Pacientes registrados',
  notas_evolucion: 'Notas de evolución',
  historias_medicas: 'Historias médicas',
  emergencias: 'Emergencias',
  historias_nutricion: 'Historias de nutrición',
  eval_antropometricas: 'Evaluaciones antropométricas',
  eval_nutricionales: 'Evaluaciones nutricionales',
}
const COUNT_ORDER = Object.keys(COUNT_LABELS)

const pct = (count, total) => (total > 0 ? `${Math.round((count / total) * 100)}%` : '0%')

// Convierte una distribución [{ [keyField]: k, count }] en una sección con filas
// [label, total, %]. Las etiquetas vienen del catálogo compartido con las gráficas.
function distributionSection(title, items, keyField, labelMap) {
  const parsed = (items ?? []).map((it) => ({
    label: labelMap[it[keyField]] ?? it[keyField],
    count: Number(it.count) || 0,
  }))
  const total = parsed.reduce((sum, r) => sum + r.count, 0)
  return {
    title,
    columns: ['Categoría', 'Total', '%'],
    rows: parsed.map((r) => [r.label, r.count, pct(r.count, total)]),
    total,
  }
}

export function areaLabelFor(area) {
  return area ? (AREA_LABELS[area] ?? area) : 'Todas'
}

/**
 * Modelo neutral de exportación: fuente única que consumen el generador de PDF
 * y el de Excel. Toma el `stats` de la página y el contexto del reporte.
 */
export function buildStatsExport(stats, { area, rangeLabel, rangeCaption, generatedBy }) {
  const counts = stats?.counts ?? {}
  const resumenRows = COUNT_ORDER.filter((key) => counts[key] != null).map((key) => [
    COUNT_LABELS[key],
    counts[key],
  ])

  return {
    title: 'Reporte de Estadísticas',
    meta: [
      ['Área', areaLabelFor(area)],
      ['Periodo', `${rangeLabel} (${rangeCaption})`],
      ['Generado', dayjs().format('DD/MM/YYYY HH:mm')],
      ['Generado por', generatedBy ?? '—'],
    ],
    sections: [
      { title: 'Resumen', columns: ['Métrica', 'Total'], rows: resumenRows },
      distributionSection(
        'Procedencia',
        stats?.distribucion_procedencia,
        'procedencia',
        PROCEDENCIA_LABELS
      ),
      distributionSection(
        'Distribución por género',
        stats?.distribucion_genero,
        'genero',
        GENDER_LABELS
      ),
      distributionSection('Distribución por edad', stats?.distribucion_edad, 'rango', AGE_LABELS),
    ],
  }
}

export function exportFileName(area, ext) {
  const slug = areaLabelFor(area)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
  return `estadisticas-${slug}-${dayjs().format('YYYY-MM-DD')}.${ext}`
}
