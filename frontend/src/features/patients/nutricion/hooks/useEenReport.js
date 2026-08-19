import { useQuery } from '@tanstack/react-query'
import { getEenReportById } from '@services/apiEenReport'

export function useEenReport(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['reporte-een', id],
    queryFn: () => getEenReportById(id),
    enabled: Boolean(id),
  })

  return { reporte: data ?? null, isPending, isError, error }
}
