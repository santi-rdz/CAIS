import { fetchApi } from '@lib/fetchApi'

// Registro atómico: crea paciente + 1ª historia nutricional en un solo request.
export async function registerNutritionPatient(body) {
  return fetchApi('/nutricion/pacientes', {
    method: 'POST',
    body,
    errorMsg: 'Error al registrar al paciente',
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
