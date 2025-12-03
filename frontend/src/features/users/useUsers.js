import { PAGE_SIZE } from '@lib/constants'
import { getUsers } from '@services/ApiUsers'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { useEffect } from 'react'

export function useUsers() {
  const [params] = useSearchParams()
  const queryClient = useQueryClient()
  const status = params.get('status')
  const sortBy = params.get('ordenarPor')
  const search = params.get('buscar')
  const page = +(params.get('page') ?? 1)

  const { data: { users, count } = {}, isPending } = useQuery({
    queryKey: ['users', status, sortBy, search, page],
    queryFn: () => getUsers({ status, sortBy, search, page }),
    staleTime: 1000 * 60 * 5, // Opcional: reduce refetches
  })

  const pageCount = count ? Math.ceil(count / PAGE_SIZE) : 0

  useEffect(() => {
    if (!count) return // No prefetchear si no hay datos aún

    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ['users', status, sortBy, search, page + 1],
        queryFn: () => getUsers({ status, sortBy, search, page: page + 1 }),
      })
    }

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ['users', status, sortBy, search, page - 1],
        queryFn: () => getUsers({ status, sortBy, search, page: page - 1 }),
      })
    }
  }, [queryClient, status, sortBy, search, page, pageCount, count])

  return { users, count, isPending }
}
