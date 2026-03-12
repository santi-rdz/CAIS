import { HiEllipsisVertical } from 'react-icons/hi2'
import useClickOutside from '@hooks/useClickOutside'
import DropdownPanel from './DropdownPanel'
import Button from './Button'
import { useRef, useEffect, useState } from 'react'

export default function RowActionsMenu({
  isOpen,
  onToggle,
  onClose,
  children,
}) {
  const triggerRef = useRef()
  const ref = useClickOutside(onClose, true)
  const [style, setStyle] = useState({})

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setStyle({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
  }, [isOpen])

  return (
    <div>
      <Button
        ref={triggerRef}
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="p-1"
      >
        <HiEllipsisVertical size={24} />
      </Button>
      {isOpen && (
        <DropdownPanel
          ref={ref}
          style={style}
          onClick={onClose}
          className="fixed z-50 p-1"
        >
          {children}
        </DropdownPanel>
      )}
    </div>
  )
}
