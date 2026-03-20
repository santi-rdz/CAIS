import { cn } from '@lib/utils'
import { HiCheck } from 'react-icons/hi2'

export default function Checkbox({ checked, onChange, id, label, className }) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'text-5 flex cursor-pointer items-center gap-2 select-none',
        className
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange ?? (() => {})}
        className="sr-only"
      />
      <span
        className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded border transition-colors duration-150',
          checked ? 'border-green-700 bg-green-700' : 'border-gray-300 bg-white'
        )}
      >
        {checked && <HiCheck size={9} className="text-white" />}
      </span>
      {label && <span className="">{label}</span>}
    </label>
  )
}
