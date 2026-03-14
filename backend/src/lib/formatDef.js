/**
 * Convierte un array de sort definitions al mapa que usa Prisma en `orderBy`.
 * @param {{ key: string, field: string, dir: 'asc' | 'desc' }[]} def
 * @returns {Record<string, Record<string, string>>} e.g. { 'nombre-asc': { nombre: 'asc' } }
 */
export function formatDefs(def) {
  return Object.fromEntries(
    def.map(({ key, field, dir }) => [key, { [field]: dir }])
  )
}
