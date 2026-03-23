import { PAGE_SIZE } from '@lib/constants'
import { getEmergencies } from '@services/ApiEmergencies'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { usePrefetchPages } from '@hooks/usePrefetchPages'

export function useEmergencies() {
  const [params] = useSearchParams()
  const sortBy = params.get('ordenarPor')
  const recurrent = params.get('recurrente') || null
  const search = params.get('buscar')
  const page = +(params.get('page') ?? 1)

  const { data: { emergencies, count } = {}, isPending } = useQuery({
    queryKey: ['emergencies', sortBy, recurrent, search, page],
    queryFn: () => getEmergencies({ sortBy, recurrent, search, page }),
    staleTime: 1000 * 60 * 5,
  })

  const pageCount = count ? Math.ceil(count / PAGE_SIZE) : 0

  usePrefetchPages({
    queryKey: ['emergencies', sortBy, recurrent, search],
    queryFn: (p) => getEmergencies({ sortBy, recurrent, search, page: p }),
    page,
    pageCount,
    count,
  })

  return { emergencies, count, isPending }
}
