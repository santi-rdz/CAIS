import { useEffect, useRef } from 'react'

export default function useClickOutside(handleClick, propagation = true, ignoreSelector = null) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (ignoreSelector && event.target.closest(ignoreSelector)) return
        handleClick()
      }
    }

    document.addEventListener('click', handleClickOutside, propagation)

    return () => document.removeEventListener('click', handleClickOutside, propagation)
  }, [ref, handleClick, propagation, ignoreSelector])

  return ref
}
