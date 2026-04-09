import dayjs from 'dayjs'
import es from 'dayjs/locale/es'

/** Extrae solo la parte de fecha (YYYY-MM-DD) para evitar corrimiento por timezone */
function dateOnly(fechaHora) {
  if (typeof fechaHora === 'string') return fechaHora.split('T')[0]
  return fechaHora
}

/** '11 marzo 2026' — para tablas */
export function formatFecha(fechaHora) {
  if (!fechaHora) return '---'
  return dayjs(dateOnly(fechaHora)).locale(es).format('DD MMMM YYYY')
}

/** '11 de marzo de 2026' — para vistas de detalle */
export function formatFechaLong(fechaHora) {
  if (!fechaHora) return '---'
  return dayjs(dateOnly(fechaHora)).locale(es).format('DD [de] MMMM [de] YYYY')
}

/** '13:25' */
export function formatHora(fechaHora) {
  if (!fechaHora) return '---'
  return dayjs(fechaHora).format('HH:mm')
}

/** Combina un dayjs de fecha con uno de hora → ISO con offset para el API */
export function mergeFechaHora(date, time) {
  return dayjs(date).hour(time.hour()).minute(time.minute()).second(0).format()
}

export function formatFechaHora(fechaHora) {
  if (!fechaHora) return '---'
  return dayjs(fechaHora).locale(es).format('DD MMM YYYY, HH:mm')
}
