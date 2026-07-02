import { fetchApi } from '@lib/fetchApi'

export async function getEvolutionNotes(historia_medica_id) {
  const params = new URLSearchParams({ historia_medica_id, limit: 50 })
  return fetchApi(`/medicina/notas-evolucion?${params}`, {
    errorMsg: 'Error al obtener notas de evolución',
  })
}

export async function getEvolutionNoteById(id) {
  return fetchApi(`/medicina/notas-evolucion/${id}`, {
    errorMsg: 'Error al obtener nota de evolución',
  })
}

export async function createEvolutionNote(data) {
  return fetchApi('/medicina/notas-evolucion', {
    method: 'POST',
    body: data,
    errorMsg: 'Error al crear nota de evolución',
  })
}

export async function updateEvolutionNote(id, data) {
  return fetchApi(`/medicina/notas-evolucion/${id}`, {
    method: 'PATCH',
    body: data,
    errorMsg: 'Error al actualizar nota de evolución',
  })
}
