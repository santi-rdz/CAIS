import { fetchApi } from '@lib/fetchApi'

export async function createEvalCalSueno(data) {
  return fetchApi('/nutricion/evaluacion-sueno', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar evaluación de sueño',
  })
}

export async function updateEvalCalSueno(id, data) {
  return fetchApi(`/nutricion/evaluacion-sueno/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar evaluación de sueño',
  })
}
