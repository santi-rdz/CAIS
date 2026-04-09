import { fetchApi } from '@lib/fetchApi'

export async function getEvolutionNotes(paciente_id) {
  const params = new URLSearchParams({ paciente_id, limit: 50 })
  return fetchApi(`/medicina/notas-evolucion?${params}`, { errorMsg: 'Error al obtener notas de evolución' })
}

export async function createEvolutionNote(data) {
  return fetchApi('/medicina/notas-evolucion', { method: 'POST', body: data, errorMsg: 'Error al crear nota de evolución' })
}
