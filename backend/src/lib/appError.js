/**
 * Error de dominio con un status HTTP intencional. Lo lanzan models, services o
 * controllers cuando quieren una respuesta concreta (404, 409, etc.); el error
 * middleware de `app.js` lo traduce al body JSON estándar `{ error, message }`.
 * Cualquier otra cosa lanzada (un throw inesperado, un error de Prisma sin
 * traducir) cae al 500 genérico.
 *
 * `isOperational` distingue estos errores esperados de bugs de programación.
 * `meta` se mergea en el body — p.ej. `{ emails }` en conflictos de correo.
 *
 *   throw new NotFoundError('el paciente') // → "No se encontró el paciente"
 *   throw new ConflictError('El correo ya está registrado')
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, { error, ...meta } = {}) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = true
    this.error = error ?? 'Error'
    this.meta = meta
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida', meta) {
    super(message, 400, { error: 'BadRequest', ...meta })
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado', meta) {
    super(message, 401, { error: 'Unauthorized', ...meta })
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado', meta) {
    super(message, 403, { error: 'Forbidden', ...meta })
  }
}

export class NotFoundError extends AppError {
  // `resource` incluye su artículo para que el género quede correcto:
  //   new NotFoundError('el paciente')  → 'No se encontró el paciente'
  //   new NotFoundError('la nota de evolución')
  constructor(resource, meta) {
    super(resource ? `No se encontró ${resource}` : 'Recurso no encontrado', 404, {
      error: 'NotFound',
      ...meta,
    })
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto', meta) {
    super(message, 409, { error: 'Conflict', ...meta })
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Datos inválidos', meta) {
    super(message, 422, { error: 'ValidationError', ...meta })
  }
}
