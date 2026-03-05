import { useCallback, useRef } from 'react'

/**
 * Shared hover open/close logic.
 * attach onEnter/onLeave to every element that should keep the dropdown open.
 */
export default function useHoverOpen(open, close, delay = 0) {
  const timer = useRef(null)

  const onEnter = useCallback(() => {
    clearTimeout(timer.current)
    open()
  }, [open])

  const onLeave = useCallback(() => {
    timer.current = setTimeout(close, delay)
  }, [close, delay])

  return { onEnter, onLeave }
}
