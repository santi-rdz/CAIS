/**
 * Error con un status HTTP intencional. Lo lanzan services, models o
 * controllers cuando quieren una respuesta concreta (409, 404, etc.) y el error
 * middleware de `app.js` lo traduce al body JSON. Cualquier otra cosa lanzada
 * (un throw inesperado, un error de Prisma sin traducir) cae al 500 genérico.
 *
 * `meta` se mergea en el body — p.ej. `{ emails }` en conflictos de correo.
 *
 *   throw new HttpError(409, 'El correo ya está registrado', { error: 'Conflict' })
 */
export class HttpError extends Error {
  constructor(status, message, { error = 'Error', ...meta } = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.error = error
    this.meta = meta
  }
}
