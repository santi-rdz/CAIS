import { fetchApi } from '@lib/fetchApi'

export async function createNutritionHistory(data) {
  return fetchApi('/nutricion/historias-nutricion', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al crear historia de nutrición',
  })
}

export async function getNutritionHistory(id) {
  return fetchApi(`/nutricion/historias-nutricion/${id}`, {
    errorMsg: 'Error al obtener historia de nutrición',
  })
}

export async function updateNutritionHistory(id, data) {
  return fetchApi(`/nutricion/historias-nutricion/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar historia de nutrición',
  })
}

export async function getNutritionHistories(paciente_id) {
  const params = new URLSearchParams({ paciente_id, fields: 'fecha_ingreso' })
  return fetchApi(`/nutricion/historias-nutricion?${params}`, {
    errorMsg: 'Error al obtener historias de nutrición',
  })
}
