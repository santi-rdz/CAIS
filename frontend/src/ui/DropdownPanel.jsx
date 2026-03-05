import { cn } from './lib/utils'

export default function DropdownPanel({
  children,
  className = '',
  style,
  ...props
}) {
  return (
    <div
      style={style}
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
