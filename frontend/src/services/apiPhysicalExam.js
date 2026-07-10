import { fetchApi } from '@lib/fetchApi'

export async function getPhysicalExams(historia_paciente_id) {
  const params = new URLSearchParams({ historia_paciente_id, limit: 50 })
  return fetchApi(`/nutricion/examinacion-fisica?${params}`, {
    errorMsg: 'Error al obtener exámenes físicos',
  })
}

export async function getPhysicalExamById(id) {
  return fetchApi(`/nutricion/examinacion-fisica/${id}`, {
    errorMsg: 'Error al obtener examen físico',
  })
}

export async function createPhysicalExam(data) {
  return fetchApi('/nutricion/examinacion-fisica', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al registrar examen físico',
  })
}

export async function updatePhysicalExam(id, data) {
  return fetchApi(`/nutricion/examinacion-fisica/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar examen físico',
  })
}

export async function deletePhysicalExam(id) {
  return fetchApi(`/nutricion/examinacion-fisica/${id}`, {
    method: 'DELETE',
    errorMsg: 'Error al eliminar examen físico',
  })
}
