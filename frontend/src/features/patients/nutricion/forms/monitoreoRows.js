import dayjs from 'dayjs'
import {
  evalCalSuenoSchema,
  evalActFisicaNutricionSchema,
} from '@cais/shared/schemas/nutricion/nutritionHistory'

// Fuente única de las columnas de cada evaluación de monitoreo: derivadas del
// schema Zod (la verdad de validación). Agregar o quitar un campo en el schema
// se propaga solo a defaults, mapeo y limpieza — sin listas paralelas que
// mantener en sincronía.
export const SUENO_ROW_KEYS = Object.keys(evalCalSuenoSchema.shape)
export const ACT_FISICA_ROW_KEYS = Object.keys(evalActFisicaNutricionSchema.shape)

// Shape de una fila para el form: fecha → dayjs (default hoy), resto de campos →
// el valor existente o '' (inputs controlados). `row` opcional (null = fila nueva).
export function buildMonitoringRow(keys, row) {
  return Object.fromEntries(
    keys.map((k) => {
      if (k === 'fecha') return ['fecha', row?.fecha ? dayjs(row.fecha) : dayjs()]
      return [k, row?.[k] ?? '']
    })
  )
}

// Igual que buildMonitoringRow pero con el flag solo-UI _deleted, para las filas
// de los field arrays del wizard (borrado-con-restauración).
export function buildMonitoringFieldRow(keys, row) {
  return { ...buildMonitoringRow(keys, row), _deleted: false }
}
