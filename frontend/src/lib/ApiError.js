import { toast } from 'sonner'

/**
 * Error enriquecido con los campos que fallaron la validación del backend.
 * @property {string} message - Mensaje principal del error.
 * @property {{ field: string, message: string }[]} fields - Errores por campo.
 */
export class ApiError extends Error {
  constructor(message, fields = []) {
    super(message)
    this.fields = fields
  }
}

/**
 * Parsea la respuesta de error del backend y lanza un ApiError.
 * @param {Response} res - Respuesta fetch no-ok.
 * @param {string} fallback - Mensaje genérico si el backend no retorna uno.
 */
export async function throwApiError(res, fallback) {
  const body = await res.json().catch(() => ({}))
  throw new ApiError(body.message || fallback, body.fields || [])
}

/**
 * Muestra un toast de error. Si hay campos, los lista como descripción.
 * @param {unknown} error
 */
export function toastApiError(error) {
  if (error instanceof ApiError && error.fields.length > 0) {
    const description = error.fields.map((f) => `• ${f.message}`).join('\n')
    toast.error(error.message, { description })
  } else {
    toast.error(error?.message ?? 'Ocurrió un error inesperado')
  }
}
