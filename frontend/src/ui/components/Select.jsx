import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { HiCheck, HiChevronRight } from 'react-icons/hi2'
import useDropdownPosition from '@hooks/useDropdownPosition'
import useHoverOpen from '@hooks/useHoverOpen'
import DropdownPanel from './DropdownPanel'
import Checkbox from './Checkbox'
import { cn } from '@lib/utils'

// ─── Context ─────────────────────────────────────────────────────────────────

export const SelectContext = createContext()

function useSelect() {
  return useContext(SelectContext)
}

// ─── Design tokens (single source of truth) ──────────────────────────────────

const ITEM_BASE =
  'flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-5 whitespace-nowrap transition-colors hover:bg-gray-100 mb-0.5 last:mb-0'

const ITEM_ACTIVE_SINGLE = 'bg-green-100 pointer-events-none text-green-900'

// ─── Root ─────────────────────────────────────────────────────────────────────

export function Select({
  children,
  // single-select
  value,
  onValueChange,
  // multi-select
  multiple = false,
  values = [],
  onValuesChange,
  dropdownHeight = 300,
  align = 'auto',
  fullWidth = false,
  className = '',
  hasError,
}) {
  const { triggerRef, isOpen, openAbove, positionStyle, open, close, toggle } =
    useDropdownPosition(dropdownHeight, { align, fullWidth })

  const labelsRef = useRef({})
  const [, forceUpdate] = useState(0)
  const seeded = useRef(false)

  const { onEnter, onLeave } = useHoverOpen(open, close)

  function registerLabel(val, label) {
    labelsRef.current[val] = label
  }

  function getLabelForValue(val) {
    return labelsRef.current[val] ?? null
  }

  function handleValueChange(val) {
    if (multiple) {
      const next = values.includes(val)
        ? values.filter((v) => v !== val)
        : [...values, val]
      onValuesChange?.(next)
    } else {
      onValueChange?.(val)
      close()
    }
  }

  // One layout re-render so SelectValue reads labels registered by SelectItems
  useLayoutEffect(() => {
    if (!seeded.current) {
      seeded.current = true
      forceUpdate((n) => n + 1)
    }
  }, [])

  return (
    <SelectContext.Provider
      value={{
        value,
        values,
        multiple,
        handleValueChange,
        isOpen,
        hasError,
        openAbove,
        positionStyle,
        registerLabel,
        getLabelForValue,
        toggle,
        close,
      }}
    >
      <div
        ref={triggerRef}
        className={cn(
          'relative',
          hasError && 'rounded-lg ring-1 ring-red-400',
          className
        )}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {children}
        {isOpen && (
          <div
            className={cn(
              'absolute left-0 h-2 w-full',
              openAbove ? 'bottom-full' : 'top-full'
            )}
          />
        )}
      </div>
    </SelectContext.Provider>
  )
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

const triggerSizes = {
  md: 'px-4 py-2.5 rounded-lg',
  lg: 'px-4 py-3.5 rounded-xl shadow-xs',
}

export function SelectTrigger({
  children,
  className = '',
  icon: Icon,
  size = 'md',
  ...props
}) {
  const { toggle, isOpen, hasError } = useSelect()
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        hasError && 'error',
        'text-5 flex w-full cursor-pointer items-center justify-center gap-2 overflow-x-auto bg-white font-medium ring ring-gray-200 transition-colors duration-100 hover:border-green-800',
        triggerSizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={16} className="shrink-0 text-gray-500" />}
      <span className="max-w-[11ch] truncate">{children}</span>
      <HiChevronRight
        size="16"
        className={`ml-auto inline-block duration-200 ${isOpen ? 'rotate-270' : 'rotate-90'}`}
      />
    </button>
  )
}

// ─── Value display ────────────────────────────────────────────────────────────

export function SelectValue({ placeholder = 'Seleccionar' }) {
  const { value, values, multiple, getLabelForValue } = useSelect()

  if (multiple) {
    if (!values.length) return <span>{placeholder}</span>
    return <span>{values.map((v) => getLabelForValue(v) ?? v).join(', ')}</span>
  }

  const label = value ? getLabelForValue(value) : null
  return <span>{label ?? placeholder}</span>
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

export function SelectContent({ children }) {
  const { isOpen, openAbove, positionStyle } = useSelect()

  return (
    <DropdownPanel
      style={positionStyle}
      className={cn(
        'fixed z-9999 w-fit min-w-40 p-1.5 transition-all duration-200',
        isOpen
          ? `pointer-events-auto scale-100 opacity-100 ${openAbove ? '-translate-y-1' : 'translate-y-1'}`
          : 'pointer-events-none scale-95 opacity-0'
      )}
    >
      {children}
    </DropdownPanel>
  )
}

// ─── Header (action row above options) ───────────────────────────────────────

export function SelectHeader({ children }) {
  return <div className="mb-1 border-b border-gray-100 pb-1">{children}</div>
}

// ─── Footer (action row below options) ───────────────────────────────────────

export function SelectFooter({ children }) {
  return <div className="mt-1 border-t border-gray-100 pt-1">{children}</div>
}

// ─── Group (with optional label + separator) ──────────────────────────────────

export function SelectGroup({ children, label, separator = false }) {
  return (
    <>
      {separator && <div className="my-1 border-t border-gray-100" />}
      {label && (
        <p className="text-7 px-3 pt-0.5 pb-1 font-semibold tracking-widest text-gray-400 uppercase select-none">
          {label}
        </p>
      )}
      <div>{children}</div>
    </>
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────
//
// Prefix is determined automatically:
//   multiple mode → checkbox
//   icon prop     → icon component
//   default       → nothing
//
// Active indicator:
//   multiple mode → checkbox fills
//   single mode   → checkmark on right + green background

export function SelectItem({ children, value, icon: Icon }) {
  const {
    handleValueChange,
    value: selectedValue,
    values,
    multiple,
    registerLabel,
  } = useSelect()

  const isActive = multiple ? values.includes(value) : selectedValue === value

  if (typeof children === 'string') {
    registerLabel(value, children)
  }

  return (
    <button
      type="button"
      onClick={() => handleValueChange(value)}
      className={`${ITEM_BASE} ${isActive && !multiple && ITEM_ACTIVE_SINGLE}`}
    >
      {multiple && <Checkbox checked={isActive} />}

      {!multiple && Icon && (
        <Icon
          size={12}
          className={cn(
            'shrink-0',
            isActive ? 'text-green-700' : 'text-gray-400'
          )}
        />
      )}

      <span>{children}</span>

      {!multiple && isActive && (
        <HiCheck size={12} className="ml-auto shrink-0 text-green-700" />
      )}
    </button>
  )
}

// ─── Standalone primitives (for edge cases) ───────────────────────────────────

export function SelectSeparator() {
  return <div className="my-1 border-t border-gray-100" />
}

export function SelectLabel({ children }) {
  return (
    <p className="px-3 pt-0.5 pb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase select-none">
      {children}
    </p>
  )
}
