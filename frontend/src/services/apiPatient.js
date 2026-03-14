import { throwApiError } from '@lib/ApiError'
import { PAGE_SIZE, BASE_URL } from '@lib/constants'

export async function getPatients({ page, sortBy, search, genre }) {
  const params = new URLSearchParams()
  if (page) {
    params.set('page', page)
    params.set('limit', PAGE_SIZE)
  }
  if (sortBy && sortBy !== 'clear') params.set('sortBy', sortBy)
  if (search) params.set('search', search)
  if (genre) params.set('genre', genre)

  const query = params.toString() ? `?${params.toString()}` : ''

  const res = await fetch(`${BASE_URL}/pacientes${query}`, {
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al obtener los pacientes')
  return await res.json()
}

export async function getPatient(id) {
  const res = await fetch(`${BASE_URL}/pacientes/${id}`, {
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al obtener paciente')
  return await res.json()
}

export async function createPatient(data) {
  const res = await fetch(`${BASE_URL}/pacientes`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al crear paciente')
  return await res.json()
}

export async function deletePatient(id) {
  const res = await fetch(`${BASE_URL}/pacientes/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'No se ha podido borrar el paciente')
  return await res.json()
}

export async function updatePatient(id, data) {
  const res = await fetch(`${BASE_URL}/pacientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al actualizar paciente')
  return await res.json()
}
