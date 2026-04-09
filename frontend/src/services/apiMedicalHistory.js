import { fetchApi } from '@lib/fetchApi'

export async function createMedicalHistory(data) {
  return fetchApi('/medicina/historias-medicas', { method: 'POST', body: data, errorMsg: 'Error al crear historia médica' })
}

export async function getMedicalHistory(id) {
  return fetchApi(`/medicina/historias-medicas/${id}`, { errorMsg: 'Error al obtener historia médica' })
}

export async function updateMedicalHistory(id, data) {
  return fetchApi(`/medicina/historias-medicas/${id}`, { method: 'PATCH', body: data, errorMsg: 'Error al actualizar historia médica' })
}

export async function getMedicalHistories(paciente_id) {
  const params = new URLSearchParams({ paciente_id, fields: 'creado_at' })
  return fetchApi(`/medicina/historias-medicas?${params}`, { errorMsg: 'Error al obtener historias médicas' })
}
