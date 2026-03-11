import { HiEllipsisVertical } from 'react-icons/hi2'
import useClickOutside from '@hooks/useClickOutside'
import DropdownPanel from './DropdownPanel'
import Button from './Button'

export default function RowActionsMenu({
  isOpen,
  onToggle,
  onClose,
  children,
}) {
  const ref = useClickOutside(onClose, true)

  return (
    <div className="relative">
      <Button onClick={onToggle} variant="ghost" size="xs" className="p-1">
        <HiEllipsisVertical size={24} />
      </Button>
      {isOpen && (
        <DropdownPanel
          ref={ref}
          portal={false}
          onClick={onClose}
          className="absolute top-full right-0 z-10 mt-2 p-1"
        >
          {children}
        </DropdownPanel>
      )}
    </div>
  )
}
