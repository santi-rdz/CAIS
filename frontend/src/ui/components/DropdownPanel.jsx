import { createPortal } from 'react-dom'
import { cn } from '@lib/utils'

export default function DropdownPanel({
  children,
  className = '',
  style,
  portal = true,
  ref,
  ...props
}) {
  const panel = (
    <div
      ref={ref}
      style={style}
      data-dropdown-panel
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )

  return portal ? createPortal(panel, document.body) : panel
}
