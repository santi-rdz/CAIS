import { useInfiniteList } from '@hooks/useInfiniteList'
import { getEenReports } from '@services/apiEenReport'

// Se monta solo al entrar al tab (Tab.Panel desmonta los inactivos), así que el
// fetch no carga la vista inicial del paciente.
export function useEenReports(historiaId) {
  return useInfiniteList({
    queryKey: ['reporte-een-list', historiaId],
    queryFn: ({ page, limit }) => getEenReports(historiaId, { page, limit }),
    listKey: 'reportes',
    enabled: !!historiaId,
  })
}
