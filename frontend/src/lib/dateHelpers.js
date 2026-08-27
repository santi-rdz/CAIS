import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// Contrato de fechas con el backend. El formato del wire ya distingue el tipo,
// por eso el parseo es uniforme; las funciones separadas marcan la intención.
//   • Fecha-sola (@db.Date): llega como 'YYYY-MM-DD' → parseDate / formatFecha.
//   • Fecha con hora (@db.DateTime): llega como ISO con offset → parseDateTime /
//     formatFechaHora.
export function parseDate(value) {
  return value ? dayjs(value) : null
}

export function parseDateTime(value) {
  return value ? dayjs(value) : null
}

/** '11 marzo 2026' — para tablas */
export function formatFecha(value) {
  if (!value) return '---'
  return dayjs(value).locale(es).format('DD MMMM YYYY')
}

/** 'hace 3 días' — recencia para dropdowns y listas compactas */
export function formatRelativo(value) {
  if (!value) return null
  return dayjs(value).locale(es).fromNow()
}

/** '11 de marzo de 2026' — para vistas de detalle */
export function formatFechaLong(value) {
  if (!value) return '---'
  return dayjs(value).locale(es).format('DD [de] MMMM [de] YYYY')
}

/** '13:25' */
export function formatHora(value) {
  if (!value) return '---'
  return dayjs(value).format('HH:mm')
}

/** Combina un dayjs de fecha con uno de hora → ISO con offset para el API */
export function mergeFechaHora(date, time) {
  return dayjs(date).hour(time.hour()).minute(time.minute()).second(0).format()
}

/** '11 mar 2026, 13:25' — fecha con hora */
export function formatFechaHora(value) {
  if (!value) return '---'
  return dayjs(value).locale(es).format('DD MMM YYYY, HH:mm')
}
