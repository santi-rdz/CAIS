import { useEffect, useRef, useState } from 'react'

export default function useDropdownPosition(
  dropdownHeight,
  { ignoreSelector = null, dropdownWidth = null } = {}
) {
  const triggerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [openAbove, setOpenAbove] = useState(false)
  const [positionStyle, setPositionStyle] = useState({})

  function open() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const above = spaceBelow < dropdownHeight

    const vertical = above
      ? { bottom: window.innerHeight - rect.top + 4 }
      : { top: rect.bottom + 4 }

    let horizontal
    if (dropdownWidth && rect.left + dropdownWidth > window.innerWidth - 8) {
      // No cabe a la derecha del trigger → alinear por la derecha
      horizontal = { right: window.innerWidth - rect.right }
    } else {
      // Alinear por la izquierda del trigger
      horizontal = { left: Math.max(8, rect.left) }
    }

    setOpenAbove(above)
    setPositionStyle({ ...vertical, ...horizontal })
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function toggle() {
    if (isOpen) close()
    else open()
  }

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e) {
      if (ignoreSelector && e.target.closest(ignoreSelector)) return
      const isClickedInside = triggerRef.current?.contains(e.target)
      const isClickedInMenu = e.target.closest?.('[data-select-menu]')
      if (!isClickedInside && !isClickedInMenu) close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, ignoreSelector])

  return { triggerRef, isOpen, openAbove, positionStyle, open, close, toggle }
}
