import { PAGE_SIZE } from '@lib/constants'
import { getUsers } from '@services/ApiUsers'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { usePrefetchPages } from '@hooks/usePrefetchPages'

export function useUsers() {
  const [params] = useSearchParams()
  const status = params.get('status')
  const rol = params.get('rol')
  const sortBy = params.get('ordenarPor')
  const search = params.get('buscar')
  const page = +(params.get('page') ?? 1)

  const { data: { users, count } = {}, isPending } = useQuery({
    queryKey: ['users', status, rol, sortBy, search, page],
    queryFn: () => getUsers({ status, rol, sortBy, search, page }),
    staleTime: 1000 * 60 * 5,
  })

  const pageCount = count ? Math.ceil(count / PAGE_SIZE) : 0

  usePrefetchPages({
    queryKey: ['users', status, rol, sortBy, search],
    queryFn: (p) => getUsers({ status, rol, sortBy, search, page: p }),
    page,
    pageCount,
    count,
  })

  return { users, count, isPending }
}
