// Helpers de listados paginados: toman el query ya sanitizado (page/limit de
// parsePagination + orderBy del modelo) y arman los args de Prisma, para no
// repetir skip/take en cada getAll.

export function buildListArgs({ page, limit, orderBy, select }) {
  return {
    skip: (page - 1) * limit,
    take: limit,
    ...(orderBy && { orderBy }),
    ...(select && { select }),
  }
}

// Búsqueda tokenizada: cada palabra debe aparecer en al menos uno de `fields`
// (AND de tokens, cada token OR). Devuelve {} si no hay término. Sin `mode`:
// MySQL ya es case-insensitive por collation.
export function buildSearchWhere(search, fields) {
  const tokens = search?.trim().split(/\s+/).filter(Boolean) ?? []
  if (tokens.length === 0) return {}
  return {
    AND: tokens.map((token) => ({
      OR: fields.map((field) => ({ [field]: { contains: token } })),
    })),
  }
}
