import { throwApiError } from '@lib/ApiError'
import { BASE_URL, PAGE_SIZE } from '@lib/constants'

export async function getEmergencies({ sortBy, search, page }) {
  const params = new URLSearchParams()

  if (sortBy && sortBy !== 'clear') params.append('sortBy', sortBy)
  if (search) params.append('search', search)
  if (page) {
    params.append('page', page)
    params.append('limit', PAGE_SIZE)
  }
  const query = params.toString() ? `?${params.toString()}` : ''

  const res = await fetch(`${BASE_URL}/emergencias${query}`, {
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al obtener las emergencias')
  return await res.json()
}

export async function getEmergency(id) {
  const res = await fetch(`${BASE_URL}/emergencias/${id}`, {
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al obtener la emergencia')
  return await res.json()
}

export async function createEmergency(data) {
  const res = await fetch(`${BASE_URL}/emergencias`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al crear la emergencia')
  return await res.json()
}
