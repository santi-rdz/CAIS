import { useEffect, useRef, useState } from 'react'

export default function useDropdownPosition(
  dropdownHeight,
  {
    ignoreSelector = null,
    _dropdownWidth = null,
    align = 'auto',
    fullWidth = false,
  } = {}
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

    const spaceRight = window.innerWidth - rect.left
    const spaceLeft = rect.right
    const autoAlignRight = spaceLeft > spaceRight

    let horizontal
    if (align === 'right' || (align === 'auto' && autoAlignRight)) {
      horizontal = { right: window.innerWidth - rect.right }
    } else {
      horizontal = { left: Math.max(8, rect.left) }
    }

    const width = fullWidth ? { width: rect.width } : {}

    setOpenAbove(above)
    setPositionStyle({ ...vertical, ...horizontal, ...width })
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
      const isClickedInMenu = e.target.closest?.('[data-dropdown-panel]')
      if (!isClickedInside && !isClickedInMenu) close()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, ignoreSelector])

  return { triggerRef, isOpen, openAbove, positionStyle, open, close, toggle }
}
