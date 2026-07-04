import { fetchApi } from '@lib/fetchApi'

export async function createEvalActFisica(data) {
  return fetchApi('/nutricion/evaluacion-actividad-fisica', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar evaluación de actividad física',
  })
}

export async function updateEvalActFisica(id, data) {
  return fetchApi(`/nutricion/evaluacion-actividad-fisica/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar evaluación de actividad física',
  })
}

export async function deleteEvalActFisica(id) {
  return fetchApi(`/nutricion/evaluacion-actividad-fisica/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar evaluación de actividad física',
  })
}
