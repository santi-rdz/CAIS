import { ConflictError, NotFoundError } from '#lib/appError.js'

// Red de seguridad: traduce códigos de error de Prisma a un AppError para los
// casos que se escapan de un guard en el model (p.ej. una carrera entre el
// findUnique del guard y la mutación). El camino normal ya lanza el AppError
// específico desde el model, así que estos mensajes son deliberadamente genéricos.
const PRISMA_ERROR_FACTORIES = {
  P2002: () => new ConflictError('El registro ya existe'),
  P2025: () => new NotFoundError('el recurso'),
  P2003: () => new ConflictError('Operación inválida por una relación existente'),
}

/** Devuelve un AppError si `err` es un error de Prisma conocido, o `null` si no. */
export function prismaErrorToAppError(err) {
  const factory = PRISMA_ERROR_FACTORIES[err?.code]
  return factory ? factory() : null
}
