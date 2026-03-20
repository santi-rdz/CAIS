import { useCallback, useRef } from 'react'

const isTouch = () => window.matchMedia('(pointer: coarse)').matches

export default function useHoverOpen(open, close, delay = 0) {
  const timer = useRef(null)

  const onEnter = useCallback(() => {
    if (isTouch()) return
    clearTimeout(timer.current)
    open()
  }, [open])

  const onLeave = useCallback(() => {
    if (isTouch()) return
    timer.current = setTimeout(close, delay)
  }, [close, delay])

  return { onEnter, onLeave }
}
