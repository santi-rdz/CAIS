import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiChevronRight } from 'react-icons/hi2'
import useDropdownPosition from '@hooks/useDropdownPosition'

const SelectContext = createContext()

export function Select({ children, value, onValueChange, dropdownHeight = 300, className = '', hasError }) {
  const { triggerRef, isOpen, openAbove, positionStyle, close, toggle } = useDropdownPosition(dropdownHeight)
  const labelsRef = useRef({})
  const [, forceUpdate] = useState(0)
  const seeded = useRef(false)

  function registerLabel(val, label) {
    labelsRef.current[val] = label
  }

  function getLabelForValue(val) {
    return labelsRef.current[val] ?? null
  }

  function handleValueChange(val) {
    onValueChange?.(val)
    close()
  }

  // SelectValue renders before SelectItems (sibling subtree renders after).
  // One layout-effect re-render seeds the label registry before the browser paints.
  useLayoutEffect(() => {
    if (!seeded.current) {
      seeded.current = true
      forceUpdate((n) => n + 1)
    }
  }, [])

  return (
    <SelectContext.Provider
      value={{ value, handleValueChange, isOpen, openAbove, positionStyle, registerLabel, getLabelForValue, toggle }}
    >
      <div className={`relative ${hasError ? 'rounded-lg ring-1 ring-red-400' : ''} ${className}`} ref={triggerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = '', ...props }) {
  const { toggle, isOpen } = useContext(SelectContext)
  return (
    <button
      type="button"
      onClick={toggle}
      className={`text-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium transition-colors duration-300 hover:border-green-800 ${className}`}
      {...props}
    >
      {children}
      <HiChevronRight
        size="16"
        className={`ml-auto inline-block duration-400 ${isOpen ? 'rotate-270' : 'rotate-90'}`}
      />
    </button>
  )
}

export function SelectValue({ placeholder = 'Seleccionar' }) {
  const { value, getLabelForValue } = useContext(SelectContext)
  const label = value ? getLabelForValue(value) : null
  return <span>{label ?? placeholder}</span>
}

export function SelectContent({ children }) {
  const { isOpen, openAbove, positionStyle } = useContext(SelectContext)
  const menuClass = [
    'fixed z-[9999] w-fit space-y-1 rounded-lg border border-neutral-100 bg-white p-2 shadow-md duration-300',
    isOpen
      ? `pointer-events-auto scale-100 opacity-100 ${openAbove ? '-translate-y-1' : 'translate-y-1'}`
      : 'pointer-events-none scale-95 opacity-0',
  ].join(' ')

  return createPortal(
    <div data-select-menu className={menuClass} style={positionStyle}>
      {children}
    </div>,
    document.body,
  )
}

export function SelectItem({ children, value, hideRadio = false }) {
  const { handleValueChange, value: selectedValue, registerLabel } = useContext(SelectContext)
  const isActive = selectedValue === value

  // Register the label during render (sync). SelectValue reads this on the
  // second render triggered by useLayoutEffect in Select.
  if (typeof children === 'string') {
    registerLabel(value, children)
  }

  return (
    <button
      type="button"
      onClick={() => handleValueChange(value)}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-start text-nowrap hover:bg-gray-100 ${isActive ? 'bg-white-mint pointer-events-none' : ''}`}
    >
      {!hideRadio && <Radio isActive={isActive} />}
      {children}
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
