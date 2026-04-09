import { throwApiError } from '@lib/ApiError'
import { BASE_URL } from '@lib/constants'

/**
 * Wrapper sobre fetch con credentials, JSON y manejo de errores.
 * @param {string} path - Ruta relativa al BASE_URL (e.g. "/pacientes")
 * @param {RequestInit & { errorMsg?: string }} options
 */
export async function fetchApi(path, { errorMsg, body, ...options } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    ...(body && {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...options.headers },
    }),
  })
  if (!res.ok) await throwApiError(res, errorMsg)
  return res.json()
}
