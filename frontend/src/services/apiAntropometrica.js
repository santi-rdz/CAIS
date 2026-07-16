import { fetchApi } from '@lib/fetchApi'

const BASE = '/nutricion/evaluacion-antropometrica'

export async function getAnthropometricEvals(historia_paciente_id) {
  const params = new URLSearchParams({ historia_paciente_id, limit: 50 })
  return fetchApi(`${BASE}?${params}`, {
    errorMsg: 'Error al obtener las evaluaciones antropométricas',
  })
}

export async function getAnthropometricEvalById(id) {
  return fetchApi(`${BASE}/${id}`, {
    errorMsg: 'Error al obtener la evaluación antropométrica',
  })
}

export async function createAnthropometricEval(data) {
  return fetchApi(BASE, {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar la evaluación antropométrica',
  })
}

export async function updateAnthropometricEval(id, data) {
  return fetchApi(`${BASE}/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar la evaluación antropométrica',
  })
}

export async function deleteAnthropometricEval(id) {
  return fetchApi(`${BASE}/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar la evaluación antropométrica',
  })
}
