import useDropdownPosition from '@hooks/useDropdownPosition'
import { HiChevronRight } from 'react-icons/hi2'
import { createPortal } from 'react-dom'
import Button from './Button'

export default function Select({ options, value, onChange, placeholder = 'Seleccionar', hasError, className = '' }) {
  const dropdownHeight = options.length * 48 + 20
  const { triggerRef, isOpen, openAbove, positionStyle, open, close, toggle } = useDropdownPosition(dropdownHeight)

  const label = value?.label || placeholder

  const menuClass = [
    'fixed z-50 w-fit space-y-1 rounded-lg border border-neutral-100 bg-white p-2 shadow-md duration-300',
    isOpen
      ? `pointer-events-auto scale-100 opacity-100 ${openAbove ? '-translate-y-1' : 'translate-y-1'}`
      : 'pointer-events-none scale-95 opacity-0',
  ].join(' ')

  return (
    <div
      className={`text-5 group relative ${hasError ? 'rounded-lg ring-1 ring-red-400' : ''} ${className}`}
      ref={triggerRef}
    >
      <Button variant="outline" size="md" type="button" className="w-full" onClick={toggle}>
        <span>{label}</span>
        <HiChevronRight size="16" className={`ml-2 inline-block duration-400 ${isOpen ? 'rotate-270' : 'rotate-90'}`} />
      </Button>
      {createPortal(
        <div className={menuClass} style={positionStyle}>
          {options.map((option) => (
            <SelectOption
              key={option.value}
              option={option}
              isActive={value?.value === option.value}
              onClick={(v) => {
                onChange(v)
                close()
              }}
            />
          ))}
        </div>,
        document.body,
      )}
    </div>
  )
}

function SelectOption({ option, isActive, onClick }) {
  const { label, value } = option

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-start text-nowrap hover:bg-gray-100 ${isActive ? 'bg-white-mint pointer-events-none' : ''}`}
    >
      {value !== 'clear' && <Radio isActive={isActive} />}
      {label}
    </button>
  )
}

function Radio({ isActive }) {
  return (
    <span
      className={`${
        isActive
          ? "ring-green-900 after:absolute after:inset-0 after:m-auto after:size-[60%] after:rounded-full after:bg-green-900 after:content-['']"
          : 'ring-gray-300'
      } relative inline-block size-2.5 rounded-full ring-2`}
    />
  )
}
