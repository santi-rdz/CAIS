/**
 * @file Catálogos cerrados del reporte EEN (Evaluación, Diagnóstico y
 * Tratamiento Nutricional). Cruzan FE↔BE: el frontend arma los selects y el
 * schema compartido valida `apetito` contra su catálogo. El valor guardado es
 * la etiqueta misma (columnas de texto en la DB), por eso value === label.
 */

const asOptions = (labels) => labels.map((v) => ({ value: v, label: v }))

export const EEN_APETITO_OPTIONS = asOptions(['Bueno', 'Muy bueno', 'Regular', 'Malo'])

export const EEN_PES_OPTIONS = asOptions([
  'NI-5.1 Ingesta energética aumentada',
  'NI-5.2 Ingesta energética insuficiente',
  'NI-5.6.2 Ingesta excesiva de grasa',
  'NC-2.2 Alteración de los valores nutricionales',
])

export const EEN_INTERVENCION_OPTIONS = asOptions([
  'Prescripción de la dieta',
  'Educación nutricional',
  'Consejería nutricional',
  'Coordinar con psicología',
  'Coordinar con medicina',
])

export const EEN_PROGRESO_OPTIONS = asOptions([
  'Nuevo',
  'Activo (progreso)',
  'Activo (recaída)',
  'Activo (sin cambios)',
  'Resuelto',
  'Descontinuado',
])
