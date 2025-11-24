import { useEffect, useRef } from 'react'

export default function useClickOutside(handleClick, propagation = true) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log('click fuera')
        handleClick()
      }
    }

    document.addEventListener('click', handleClickOutside, propagation)

    return () => document.removeEventListener('click', handleClickOutside, propagation)
  }, [ref, handleClick, propagation])

  return ref
}
