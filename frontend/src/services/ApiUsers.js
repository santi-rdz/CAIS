import { PAGE_SIZE, BASE_URL } from '@lib/constants'

export async function getUsers({ status, sortBy, search, page }) {
  try {
    const params = new URLSearchParams()

    if (status) params.append('status', status)
    if (sortBy && sortBy !== 'clear') params.append('sortBy', sortBy)
    if (search) params.append('search', search)
    if (page) {
      params.append('page', page)
      params.append('limit', PAGE_SIZE)
    }
    const query = params.toString() ? `?${params.toString()}` : ''

    const res = await fetch(`${BASE_URL}/usuarios${query}`)
    if (!res.ok) throw new Error('Error al obtener los usuarios')
    const data = await res.json()
    return data
  } catch (error) {
    return { error: true, message: error.message }
  }
}

export async function getUser(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error al obtener usuario')
  }
  return await res.json()
}

export async function createUser(data) {
  const res = await fetch(`${BASE_URL}/usuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Error al crear usuario')
  }
  return await res.json()
}

export async function registroUsuario(data) {
  const res = await fetch(`${BASE_URL}/usuarios/registro`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Error al completar el registro')
  }
  return await res.json()
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/usuarios/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('No se ha podido borrar el usuario')
  return await res.json()
}
