import { fetchApi } from '@lib/fetchApi'
import { PAGE_SIZE } from '@lib/constants'

export async function getEmergencies({ sortBy, search, page, recurrent }) {
  const params = new URLSearchParams()

  if (sortBy && sortBy !== 'clear') params.append('sortBy', sortBy)
  if (search) params.append('search', search)
  if (page) {
    params.append('page', page)
    params.append('limit', PAGE_SIZE)
  }
  if (recurrent !== null) params.append('recurrente', recurrent)
  const query = params.toString() ? `?${params.toString()}` : ''

  return fetchApi(`/medicina/emergencias${query}`, {
    errorMsg: 'Error al obtener las emergencias',
  })
}

export async function getEmergency(id) {
  return fetchApi(`/medicina/emergencias/${id}`, {
    errorMsg: 'Error al obtener la emergencia',
  })
}

export async function updateEmergency(id, data) {
  return fetchApi(`/medicina/emergencias/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar la emergencia',
  })
}

export async function createEmergency(data) {
  return fetchApi('/medicina/emergencias', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al crear la emergencia',
  })
}

export async function deleteEmergency(id) {
  return fetchApi(`/medicina/emergencias/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar la emergencia',
  })
}
