import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@hooks/useDebounce'
import { searchIcd11 } from '@services/apiIcd11'

const MAX_RESULTS = 8

export default function useIcd11Search(query) {
  const q = query.trim()
  const debounced = useDebounce(q, 350)
  const enabled = debounced.length >= 1

  const {
    data = [],
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['icd11', debounced],
    queryFn: () => searchIcd11(debounced),
    enabled,
    staleTime: 5 * 60 * 1000,
  })

  // Muestra "buscando" mientras el debounce se asienta o la query corre.
  const isLoading = q.length >= 1 && (q !== debounced || isFetching)

  return { results: data.slice(0, MAX_RESULTS), isLoading, isError }
}
