import { fetchApi } from '@lib/fetchApi'

export async function getStats(range) {
  const query = range ? `?range=${range}` : ''
  return fetchApi(`/stats${query}`, {
    errorMsg: 'Error al obtener estadísticas',
  })
}
