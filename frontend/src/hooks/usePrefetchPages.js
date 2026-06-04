import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Prefetches adjacent pages (next and previous) for paginated queries.
 *
 * @param {object} opts
 * @param {unknown[]} opts.queryKey - Query key without the page segment
 * @param {(page: number) => Promise} opts.queryFn - Fetcher that accepts a page number
 * @param {number} opts.page - Current page
 * @param {number} opts.pageCount - Total number of pages
 * @param {number} opts.count - Total record count (skips prefetch when 0)
 */
export function usePrefetchPages({ queryKey, queryFn, page, pageCount, count }) {
  const queryClient = useQueryClient()
  const queryFnRef = useRef(queryFn)
  queryFnRef.current = queryFn

  const queryKeyStr = JSON.stringify(queryKey)

  useEffect(() => {
    if (!count) return
    const baseKey = JSON.parse(queryKeyStr)

    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: [...baseKey, page + 1],
        queryFn: () => queryFnRef.current(page + 1),
      })
    }

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: [...baseKey, page - 1],
        queryFn: () => queryFnRef.current(page - 1),
      })
    }
  }, [queryClient, page, pageCount, count, queryKeyStr])
}
