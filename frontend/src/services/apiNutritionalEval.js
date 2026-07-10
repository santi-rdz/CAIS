import { fetchApi } from '@lib/fetchApi'

export async function getNutritionalEvals(historia_paciente_id) {
  const params = new URLSearchParams({ historia_paciente_id, limit: 50 })
  return fetchApi(`/nutricion/evaluacion-nutricional?${params}`, {
    errorMsg: 'Error al obtener evaluaciones nutricionales',
  })
}

export async function getNutritionalEvalById(id) {
  return fetchApi(`/nutricion/evaluacion-nutricional/${id}`, {
    errorMsg: 'Error al obtener evaluación nutricional',
  })
}

export async function createNutritionalEval(data) {
  return fetchApi('/nutricion/evaluacion-nutricional', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar evaluación nutricional',
  })
}

export async function updateNutritionalEval(id, data) {
  return fetchApi(`/nutricion/evaluacion-nutricional/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar evaluación nutricional',
  })
}

export async function deleteNutritionalEval(id) {
  return fetchApi(`/nutricion/evaluacion-nutricional/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar evaluación nutricional',
  })
}
