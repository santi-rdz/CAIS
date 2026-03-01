import { cloneElement, createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import useClickOutside from '@hooks/useClickOutside'

const ModalContext = createContext()

export default function Modal({ children, heading, description }) {
  const [openName, setOpenName] = useState('')
  const close = () => setOpenName('')
  const open = setOpenName
  return (
    <ModalContext.Provider value={{ openName, close, open, heading, description }}>{children}</ModalContext.Provider>
  )
}

Modal.Open = function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext)
  return cloneElement(children, { onClick: () => open(opensWindowName) })
}

Modal.Content = function Content({ children, name, noPadding = false }) {
  const { openName, close } = useContext(ModalContext)
  const ref = useClickOutside(
    close,
    true,
    '[class*="MuiPickers"], [class*="MuiDateCalendar"], [data-datepicker-calendar]',
  )
  const showModal = openName === name

  if (!showModal) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="relative flex max-h-[95vh] max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
        ref={ref}
      >
        <button
          onClick={close}
          className="absolute top-4 right-5 z-20 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <HiXMark className="size-5" />
        </button>

        <div className={`flex min-h-0 flex-1 flex-col ${noPadding ? '' : 'overflow-y-auto p-8'}`}>
          {cloneElement(children, { onCloseModal: close })}
        </div>
      </div>
    </div>,
    document.body,
  )
}
