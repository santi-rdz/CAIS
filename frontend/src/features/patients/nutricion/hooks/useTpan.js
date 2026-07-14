import { useQuery } from '@tanstack/react-query'
import { getTpanById } from '@services/apiTpan'

export function useTpan(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tpan', id],
    queryFn: () => getTpanById(id),
    enabled: Boolean(id),
  })

  return { tpan: data ?? null, isPending, isError, error }
}
