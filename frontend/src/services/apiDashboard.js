import { fetchApi } from '@lib/fetchApi'

export async function getDashboardStats() {
  return fetchApi('/dashboard/stats', {
    errorMsg: 'Error al obtener estadísticas del dashboard',
  })
}
