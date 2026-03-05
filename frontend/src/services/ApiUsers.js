import { PAGE_SIZE, BASE_URL } from '@lib/constants'
import { throwApiError } from '@lib/ApiError'

export async function getUsers({ status, rol, sortBy, search, page }) {
  const params = new URLSearchParams()

  if (status) params.append('status', status)
  if (rol) params.append('rol', rol)
  if (sortBy && sortBy !== 'clear') params.append('sortBy', sortBy)
  if (search) params.append('search', search)
  if (page) {
    params.append('page', page)
    params.append('limit', PAGE_SIZE)
  }
  const query = params.toString() ? `?${params.toString()}` : ''

  const res = await fetch(`${BASE_URL}/usuarios${query}`)
  if (!res.ok) await throwApiError(res, 'Error al obtener los usuarios')
  return await res.json()
}

export async function getUser(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`)
  if (!res.ok) await throwApiError(res, 'Error al obtener usuario')
  return await res.json()
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) await throwApiError(res, 'Error al crear usuario')
  return await res.json()
}

export async function registroUsuario(data) {
  const res = await fetch(`${BASE_URL}/usuarios/registro`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) await throwApiError(res, 'Error al completar el registro')
  return await res.json()
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, { method: 'DELETE' })
  if (!res.ok) await throwApiError(res, 'No se ha podido borrar el usuario')
  return await res.json()
}
