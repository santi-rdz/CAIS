/**
 * Transforma los issues de Zod en un array de { field, message }
 * para retornar errores estructurados al cliente.
 *
 * @param {import('zod').ZodError} zodError
 * @returns {{ field: string, message: string }[]}
 */
export function formatZodErrors(zodError) {
  return JSON.parse(zodError.message).map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : '_form',
    message: issue.message,
  }))
}
