// Fecha sin hora (@db.Date) → se emite como 'YYYY-MM-DD'. Prisma la entrega como
// Date en UTC-midnight, y sin este recorte `dayjs(valor)` en el navegador la
// retrocede un día. (Los @db.DateTime con hora real se dejan como ISO.)
export function toDateOnly(value) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value
}

export function withDateOnly(obj, keys) {
  if (!obj) return obj
  const out = { ...obj }
  for (const key of keys) {
    if (out[key] != null) out[key] = toDateOnly(out[key])
  }
  return out
}
