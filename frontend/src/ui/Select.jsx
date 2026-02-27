import useClickOutside from '@hooks/useClickOutside'
import { useState } from 'react'
import { HiChevronRight } from 'react-icons/hi2'
import Button from './Button'

export default function Select({ options, value, onChange, placeholder = 'Seleccionar', className = '' }) {
  const [isOpen, setIsOpen] = useState(false)

  const ref = useClickOutside(() => setIsOpen(false))
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((open) => !open)

  const label = value?.label || placeholder

  return (
    <div onMouseEnter={open} onMouseLeave={close} className={`text-5 group relative w-39 ${className}`} ref={ref}>
      <Button variant="outline" size="md" type="button" className="" onClick={toggle}>
        <span>{label}</span>
        <HiChevronRight size="16" className={`ml-2 inline-block duration-400 ${isOpen ? 'rotate-270' : 'rotate-90'}`} />
      </Button>
      {/* Invisible element */}
      <div className="absolute top-full left-0 h-4 w-full cursor-default" />
      <div
        className={`${isOpen ? 'pointer-events-auto translate-y-2 scale-100 opacity-100 ' : 'pointer-events-none opacity-0'} absolute top-full right-0 z-10 w-44 scale-95 space-y-1 rounded-lg border border-neutral-100 bg-white p-2 shadow-md duration-300`}
      >
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
      </div>
    </div>
  )
}

function SelectOption({ option, isActive, onClick }) {
  const { label, value } = option

  function handleClick() {
    onClick(value)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
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
    ></span>
  )
}
