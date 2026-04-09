import { fetchApi } from '@lib/fetchApi'
import { PAGE_SIZE } from '@lib/constants'

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
  return fetchApi(`/pacientes${query}`, { errorMsg: 'Error al obtener los pacientes' })
}

export async function getPatient(id) {
  return fetchApi(`/pacientes/${id}`, { errorMsg: 'Error al obtener paciente' })
}

export async function createPatient(data) {
  return fetchApi('/pacientes', { method: 'POST', body: data, errorMsg: 'Error al crear paciente' })
}

export async function deletePatient(id) {
  return fetchApi(`/pacientes/${id}`, { method: 'DELETE', errorMsg: 'No se ha podido borrar el paciente' })
}

export async function updatePatient(id, data) {
  return fetchApi(`/pacientes/${id}`, { method: 'PATCH', body: data, errorMsg: 'Error al actualizar paciente' })
}
