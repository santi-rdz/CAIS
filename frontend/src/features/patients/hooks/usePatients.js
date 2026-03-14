import { PAGE_SIZE } from '@lib/constants'
import { usePrefetchPages } from '@hooks/usePrefetchPages'
import { getPatients } from '@services/apiPatient'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

export function usePatients() {
  const [params] = useSearchParams()
  const sortBy = params.get('ordenarPor')
  const search = params.get('buscar')
  const page = +(params.get('page') ?? 1)
  const genre = params.get('genero') || null
  const { data: { patients, count } = {}, isPending } = useQuery({
    queryKey: ['patients', sortBy, search, page, genre],
    queryFn: () => getPatients({ sortBy, search, page, genre }),
    staleTime: 1000 * 60 * 5,
  })

  const pageCount = count ? Math.ceil(count / PAGE_SIZE) : 0
  usePrefetchPages({
    queryKey: ['patients', sortBy, search, genre],
    queryFn: (p) => getPatients({ sortBy, search, genre, page: p }),
    page,
    pageCount,
    count,
  })

  return { patients, count, isPending }
}
