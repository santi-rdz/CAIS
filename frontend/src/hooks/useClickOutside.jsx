import { useEffect, useRef } from 'react'

export default function useClickOutside(handleClick, propagation = false) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log('click fuera')
        handleClick()
      }
    }

    document.addEventListener('mousedown', handleClickOutside, propagation)

    return () => document.removeEventListener('mousedown', handleClickOutside, propagation)
  }, [ref, handleClick, propagation])

  return ref
}
