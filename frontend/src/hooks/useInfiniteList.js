import { useInfiniteQuery } from '@tanstack/react-query'
import { PAGE_SIZE } from '@lib/constants'

/**
 * Lista paginada con "cargar más" sobre el envelope { <listKey>: [...], count }
 * del backend. Devuelve los ítems acumulados bajo `listKey` (para que el caller
 * consuma `data[listKey]` igual que con useQuery) + los controles de infinite.
 *
 * @param {object} opts
 * @param {any[]} opts.queryKey
 * @param {(p: { page: number, limit: number }) => Promise<object>} opts.queryFn
 * @param {string} opts.listKey - clave del array dentro del envelope (ej. 'notes')
 * @param {number} [opts.limit=PAGE_SIZE]
 * @param {boolean} [opts.enabled=true]
 */
export function useInfiniteList({ queryKey, queryFn, listKey, limit = PAGE_SIZE, enabled = true }) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn({ page: pageParam, limit }),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      const loaded = allPages.reduce((n, p) => n + (p[listKey]?.length ?? 0), 0)
      const total = allPages[0]?.count ?? 0
      return loaded < total ? allPages.length + 1 : undefined
    },
  })

  const items = query.data?.pages.flatMap((p) => p[listKey] ?? []) ?? []

  return {
    [listKey]: items,
    count: query.data?.pages[0]?.count ?? 0,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
  }
}
