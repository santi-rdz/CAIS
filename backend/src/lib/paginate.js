import {
  PAGE_SIZE,
  MAX_PAGE_SIZE,
  DEFAULT_PAGE,
} from '@cais/shared/constants/pagination'

/**
 * Extrae y sanitiza page/limit de los query params.
 * `limit` se clampea a MAX_PAGE_SIZE aunque el cliente mande un valor mayor.
 * @param {Record<string, string>} query - req.query de Express
 * @returns {{ page: number, limit: number }}
 */
export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE)
  const limit = Math.min(
    Math.max(1, parseInt(query.limit) || PAGE_SIZE),
    MAX_PAGE_SIZE
  )
  return { page, limit }
}
