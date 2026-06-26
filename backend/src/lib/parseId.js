/**
 * Parsea un id de path param que la DB guarda como entero autoincrement.
 * Devuelve el entero si es positivo, o null si no es un entero válido > 0
 * (para que el controlador responda 422 sin tocar la DB).
 */
export function parsePositiveIntId(rawId) {
  const n = Number(rawId)
  return Number.isInteger(n) && n > 0 ? n : null
}

/** Predicado para `validateParam`: true si `value` es un entero positivo. */
export function isPositiveIntId(value) {
  return parsePositiveIntId(value) !== null
}
