import { useQuery } from '@tanstack/react-query'
import { getCalGetNutrById } from '@services/apiCalGetNutr'

export function useCalGetNutr(id) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['cal-get-nutr', id],
    queryFn: () => getCalGetNutrById(id),
    enabled: Boolean(id),
  })

  return { registro: data ?? null, isPending, isError, error }
}
