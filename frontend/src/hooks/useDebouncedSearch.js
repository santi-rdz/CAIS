import { useSearchParams } from 'react-router'
import { useEffect, useState } from 'react'

export function useDebouncedSearch(delay = 500) {
  const [params, setParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(params.get('buscar') || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchValue.trim()) {
        params.delete('buscar')
        setParams(params)
        return
      }

      params.set('buscar', searchValue)
      params.set('page', 1)
      setParams(params)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchValue, setParams, params, delay])

  return { searchValue, setSearchValue }
}
