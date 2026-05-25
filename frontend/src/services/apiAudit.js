import { fetchApi } from '@lib/fetchApi'

export async function getAuditByUser(usuarioId, { page, limit, entidad } = {}) {
  const params = new URLSearchParams()
  params.append('usuario_id', usuarioId)
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  if (entidad) params.append('entidad', entidad)

  return fetchApi(`/audit?${params.toString()}`, {
    errorMsg: 'Error al obtener la actividad',
  })
}
