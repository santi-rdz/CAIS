import { HiEllipsisVertical } from 'react-icons/hi2'
import useClickOutside from '@hooks/useClickOutside'
import DropdownPanel from './DropdownPanel'
import { useRef, useState } from 'react'

export default function RowActionsMenu({ children, 'data-testid': testId }) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef()
  const ref = useClickOutside(() => setIsOpen(false), true)
  const [style, setStyle] = useState({})

  function handleToggle(e) {
    e.stopPropagation()
    setIsOpen((v) => {
      const next = !v
      if (next && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setStyle({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
      }
      return next
    })
  }

  return (
    <div>
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggle}
        className="cursor-pointer rounded-sm p-1 text-gray-700 duration-200 hover:bg-gray-100"
        data-testid={testId}
      >
        <HiEllipsisVertical size={24} />
      </button>
      {isOpen && (
        <DropdownPanel
          ref={ref}
          style={style}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(false)
          }}
          className="fixed z-50 p-1"
        >
          {children}
        </DropdownPanel>
      )}
    </div>
  )
}
