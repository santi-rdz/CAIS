import { fetchApi } from '@lib/fetchApi'

export async function getRec24hs(historia_paciente_id) {
  const params = new URLSearchParams({ historia_paciente_id, limit: 50 })
  return fetchApi(`/nutricion/rec-24h?${params}`, {
    errorMsg: 'Error al obtener recordatorios de 24 horas',
  })
}

export async function getRec24hById(id) {
  return fetchApi(`/nutricion/rec-24h/${id}`, {
    errorMsg: 'Error al obtener el recordatorio de 24 horas',
  })
}

export async function createRec24h(data) {
  return fetchApi('/nutricion/rec-24h', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar el recordatorio de 24 horas',
  })
}

export async function updateRec24h(id, data) {
  return fetchApi(`/nutricion/rec-24h/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar el recordatorio de 24 horas',
  })
}

export async function deleteRec24h(id) {
  return fetchApi(`/nutricion/rec-24h/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar el recordatorio de 24 horas',
  })
}
