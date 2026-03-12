import { cloneElement, createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import useClickOutside from '@hooks/useClickOutside'
import Heading from './Heading'

const ModalContext = createContext()

export default function Modal({ children, variant = 'default', icon }) {
  const [openName, setOpenName] = useState('')
  return (
    <ModalContext.Provider
      value={{
        openName,
        close: () => setOpenName(''),
        open: setOpenName,
        variant,
        icon,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

Modal.Heading = function ModalHeadingComp({ children }) {
  const { variant, icon } = useContext(ModalContext)
  if (variant === 'alert') {
    return (
      <div className="flex flex-col items-center gap-1.5 p-8 text-center">
        {icon && (
          <div className="mb-2 rounded-md bg-gray-200 p-2 text-red-600">
            {icon}
          </div>
        )}
        {children}
      </div>
    )
  }
  return (
    <header className="space-y-1 border-b border-b-neutral-200 p-8">
      {children}
    </header>
  )
}

Modal.Title = function ModalTitleComp({ children }) {
  const { variant } = useContext(ModalContext)
  if (variant === 'alert') {
    return <p className="text-base font-semibold text-zinc-800">{children}</p>
  }
  return <Heading as="h2">{children}</Heading>
}

Modal.Description = function ModalDescriptionComp({ children }) {
  return <p className="text-sm text-balance text-zinc-500">{children}</p>
}

Modal.Open = function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext)
  return cloneElement(children, { onClick: () => open(opensWindowName) })
}

Modal.Content = function Content({
  children,
  name,
  noPadding = false,
  size = 'md',
}) {
  const { openName, close, variant } = useContext(ModalContext)
  const ref = useClickOutside(
    close,
    true,
    '[class*="MuiPickers"], [class*="MuiDateCalendar"], [data-datepicker-calendar], [data-timepicker-clock], [data-select-menu]'
  )

  if (openName !== name) return null

  const sizeClass =
    variant === 'alert'
      ? 'w-fit'
      : ({ sm: 'w-lg', md: 'w-2xl', lg: 'w-3xl', xl: 'w-4xl' }[size] ?? 'w-2xl')

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`relative flex max-h-[80vh] ${sizeClass} flex-col overflow-hidden rounded-xl bg-white shadow-xl`}
        ref={ref}
      >
        <button
          onClick={close}
          className="absolute top-4 right-5 z-20 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <HiXMark className="size-5" />
        </button>
        <div
          className={`flex min-h-0 flex-1 flex-col ${noPadding ? '' : 'overflow-y-auto p-8'}`}
        >
          {cloneElement(children, { onCloseModal: close })}
        </div>
      </div>
    </div>,
    document.body
  )
}
