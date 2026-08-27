import { useEffect, useState } from 'react'

// Devuelve `value` con un retraso de `delay` ms tras el último cambio.
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
