import { useQuery } from '@tanstack/react-query'
import { getRec24hById } from '@services/apiRec24h'

export function useRec24h(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['rec-24h', id],
    queryFn: () => getRec24hById(id),
    enabled: Boolean(id),
  })

  return { rec: data ?? null, isPending, isError, error }
}
