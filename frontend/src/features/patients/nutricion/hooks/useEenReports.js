import { useQuery } from '@tanstack/react-query'
import { getEenReports } from '@services/apiEenReport'

// Se monta solo al entrar al tab (Tab.Panel desmonta los inactivos), así que el
// fetch no carga la vista inicial del paciente.
export function useEenReports(historiaId) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['reporte-een-list', historiaId],
    queryFn: () => getEenReports(historiaId),
    enabled: !!historiaId,
  })

  return { reportes: data?.reportes ?? [], isPending, isError, error }
}
