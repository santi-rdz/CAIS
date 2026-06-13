import {
  Children,
  createContext,
  useCallback,
  use,
  useLayoutEffect,
  useMemo,
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

const SelectContext = createContext()

export function useSelect() {
  return use(SelectContext)
}

const EMPTY_VALUES = []

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
  values = EMPTY_VALUES,
  onValuesChange,
  dropdownHeight = 300,
  align = 'auto',
  fullWidth = false,
  allowCustom = false,
  className = '',
  hasError,
}) {
  const { triggerRef, isOpen, openAbove, positionStyle, open, close, toggle } = useDropdownPosition(
    dropdownHeight,
    { align, fullWidth }
  )

  const labelsRef = useRef({})
  const [, forceUpdate] = useState(0)
  const seeded = useRef(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Wrap close so search resets atomically — avoids the extra render of a useEffect
  const closeAndReset = useCallback(() => {
    close()
    setSearchQuery('')
  }, [close])

  const { onEnter, onLeave } = useHoverOpen(open, closeAndReset)

  const registerLabel = useCallback((val, label) => {
    labelsRef.current[val] = label
  }, [])

  const getLabelForValue = useCallback((val) => labelsRef.current[val] ?? null, [])

  const handleValueChange = useCallback(
    (val) => {
      if (multiple) {
        const next = values.includes(val) ? values.filter((v) => v !== val) : [...values, val]
        onValuesChange?.(next)
      } else {
        onValueChange?.(val)
        closeAndReset()
      }
    },
    [multiple, values, onValuesChange, onValueChange, closeAndReset]
  )

  const handleCustomAdd = useCallback(
    (val) => {
      handleValueChange(val)
    },
    [handleValueChange]
  )

  // One layout re-render so SelectValue reads labels registered by SelectItems
  useLayoutEffect(() => {
    if (!seeded.current) {
      seeded.current = true
      forceUpdate((n) => n + 1)
    }
  }, [])

  const handleBlur = useCallback(
    (e) => {
      const { currentTarget, relatedTarget } = e
      setTimeout(() => {
        if (!currentTarget.contains(relatedTarget)) closeAndReset()
      }, 0)
    },
    [closeAndReset]
  )

  const contextValue = useMemo(
    () => ({
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
      close: closeAndReset,
      searchQuery,
      setSearchQuery,
      handleCustomAdd: allowCustom ? handleCustomAdd : null,
    }),
    [
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
      closeAndReset,
      searchQuery,
      allowCustom,
      handleCustomAdd,
    ]
  )

  return (
    <SelectContext.Provider value={contextValue}>
      <div
        ref={triggerRef}
        className={cn('relative', className)}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onBlur={handleBlur}
      >
        {children}
        {isOpen && (
          <div
            className={cn('absolute left-0 h-2 w-full', openAbove ? 'bottom-full' : 'top-full')}
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
  hasError: hasErrorProp,
  ...props
}) {
  const { toggle, isOpen, hasError: contextHasError } = useSelect()
  const hasError = hasErrorProp ?? contextHasError

  return (
    <button
      type="button"
      onClick={toggle}
      tabIndex={0}
      className={cn(
        hasError ? 'error' : 'focus-visible:outline-[1.5px] focus-visible:outline-green-900',
        'text-5 flex w-full cursor-pointer items-center justify-center gap-2 overflow-x-auto border border-gray-200 bg-white font-medium shadow-xs transition-colors duration-100',
        triggerSizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={16} className="shrink-0 text-gray-500" />}
      <span className="truncate">{children}</span>
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

  const label = value ? (getLabelForValue(value) ?? value) : null
  return <span>{label ?? placeholder}</span>
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

export function SelectContent({ children, portal = false, maxHeight = 220 }) {
  const { isOpen, openAbove, positionStyle, searchQuery, handleCustomAdd } = useSelect()

  const childArray = Children.toArray(children)
  const searchChild = childArray.find((c) => c.type === SelectSearch)
  const rest = childArray.filter((c) => c.type !== SelectSearch)

  const hasExactMatch =
    searchQuery &&
    rest
      .filter((c) => c.type === SelectItem)
      .some((c) => String(c.props.children).toLowerCase() === searchQuery.toLowerCase())

  const showAddOption = handleCustomAdd && searchQuery.trim() && !hasExactMatch

  return (
    <DropdownPanel
      portal={portal}
      style={positionStyle}
      className={cn(
        'fixed z-9999 w-fit min-w-40 p-1.5 transition-all duration-200',
        isOpen
          ? `pointer-events-auto scale-100 opacity-100 ${openAbove ? '-translate-y-1' : 'translate-y-1'}`
          : 'pointer-events-none scale-95 opacity-0'
      )}
    >
      {searchChild}
      <div style={{ maxHeight }} className="overflow-y-auto">
        {rest}
        {showAddOption && (
          <button
            type="button"
            onClick={() => handleCustomAdd(searchQuery.trim())}
            className="text-5 mt-0.5 flex w-full cursor-pointer items-center gap-2 rounded-sm border-t border-gray-100 px-3 py-1.5 pt-2 text-green-700 transition-colors hover:bg-green-50"
          >
            <span className="font-medium">+</span>
            Agregar &ldquo;{searchQuery.trim()}&rdquo;
          </button>
        )}
      </div>
    </DropdownPanel>
  )
}

// ─── Search ───────────────────────────────────────────────────────────────────

export function SelectSearch({ placeholder = 'Buscar...' }) {
  const { searchQuery, setSearchQuery, handleCustomAdd } = useSelect()

  function handleKeyDown(e) {
    if (e.key === 'Enter' && searchQuery.trim() && handleCustomAdd) {
      e.preventDefault()
      handleCustomAdd(searchQuery.trim())
    }
  }

  return (
    <div className="-mx-1.5 -mt-1.5 mb-1.5 border-b border-gray-100">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus
        className="text-5 w-full rounded-t-xl bg-white px-4 py-2.5 outline-none placeholder:text-gray-400 focus:bg-gray-50"
      />
    </div>
  )
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
    isOpen,
    registerLabel,
    searchQuery,
  } = useSelect()

  const isActive = multiple ? values.includes(value) : selectedValue === value

  if (typeof children === 'string') {
    registerLabel(value, children)
  }

  if (searchQuery && !String(children).toLowerCase().includes(searchQuery.toLowerCase())) {
    return null
  }

  return (
    <button
      type="button"
      tabIndex={isOpen ? 0 : -1}
      onClick={() => handleValueChange(value)}
      className={`${ITEM_BASE} ${isActive && !multiple && ITEM_ACTIVE_SINGLE}`}
    >
      {multiple && <Checkbox checked={isActive} />}

      {!multiple && Icon && (
        <Icon size={12} className={cn('shrink-0', isActive ? 'text-green-700' : 'text-gray-400')} />
      )}

      <span>{children}</span>

      {!multiple && isActive && <HiCheck size={12} className="ml-auto shrink-0 text-green-700" />}
    </button>
  )
}
