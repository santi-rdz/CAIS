import { fetchApi } from '@lib/fetchApi'

export async function getTpans(historia_paciente_id) {
  const params = new URLSearchParams({ historia_paciente_id, limit: 50 })
  return fetchApi(`/nutricion/tpan?${params}`, {
    errorMsg: 'Error al obtener los registros TPAN',
  })
}

export async function getTpanById(id) {
  return fetchApi(`/nutricion/tpan/${id}`, {
    errorMsg: 'Error al obtener el registro TPAN',
  })
}

export async function createTpan(data) {
  return fetchApi('/nutricion/tpan', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar el TPAN',
  })
}

export async function updateTpan(id, data) {
  return fetchApi(`/nutricion/tpan/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar el TPAN',
  })
}

export async function deleteTpan(id) {
  return fetchApi(`/nutricion/tpan/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar el TPAN',
  })
}
