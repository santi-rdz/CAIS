import { throwApiError } from '@lib/ApiError'
import { BASE_URL } from '@lib/constants'

export async function getEvolutionNotes(paciente_id) {
  const params = new URLSearchParams({ paciente_id, limit: 50 })
  const res = await fetch(`${BASE_URL}/medicina/notas-evolucion?${params}`, {
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al obtener notas de evolución')
  return await res.json()
}

export async function createEvolutionNote(data) {
  const res = await fetch(`${BASE_URL}/medicina/notas-evolucion`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  if (!res.ok) await throwApiError(res, 'Error al crear nota de evolución')
  return await res.json()
}
