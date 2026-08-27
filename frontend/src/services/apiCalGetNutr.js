import { fetchApi } from '@lib/fetchApi'

export async function getCalGetNutrs(historia_paciente_id, { page = 1, limit } = {}) {
  const params = new URLSearchParams({ historia_paciente_id, page })
  if (limit) params.append('limit', limit)
  return fetchApi(`/nutricion/cal-get-nutr?${params}`, {
    errorMsg: 'Error al obtener los cálculos de GET nutricional',
  })
}

export async function getCalGetNutrById(id) {
  return fetchApi(`/nutricion/cal-get-nutr/${id}`, {
    errorMsg: 'Error al obtener el cálculo de GET nutricional',
  })
}

export async function createCalGetNutr(data) {
  return fetchApi('/nutricion/cal-get-nutr', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar el cálculo de GET nutricional',
  })
}

export async function updateCalGetNutr(id, data) {
  return fetchApi(`/nutricion/cal-get-nutr/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar el cálculo de GET nutricional',
  })
}

export async function deleteCalGetNutr(id) {
  return fetchApi(`/nutricion/cal-get-nutr/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar el cálculo de GET nutricional',
  })
}
