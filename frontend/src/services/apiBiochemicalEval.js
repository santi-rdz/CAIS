import { fetchApi } from '@lib/fetchApi'

export async function getBiochemicalEvals(historia_paciente_id) {
  const params = new URLSearchParams({ historia_paciente_id, limit: 50 })
  return fetchApi(`/nutricion/evaluacion-bioquimica?${params}`, {
    errorMsg: 'Error al obtener evaluaciones bioquímicas',
  })
}

export async function getBiochemicalEvalById(id) {
  return fetchApi(`/nutricion/evaluacion-bioquimica/${id}`, {
    errorMsg: 'Error al obtener evaluación bioquímica',
  })
}

export async function createBiochemicalEval(data) {
  return fetchApi('/nutricion/evaluacion-bioquimica', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar evaluación bioquímica',
  })
}

export async function updateBiochemicalEval(id, data) {
  return fetchApi(`/nutricion/evaluacion-bioquimica/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar evaluación bioquímica',
  })
}

export async function deleteBiochemicalEval(id) {
  return fetchApi(`/nutricion/evaluacion-bioquimica/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar evaluación bioquímica',
  })
}
