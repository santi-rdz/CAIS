import { cloneElement, createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import useClickOutside from '@hooks/useClickOutside'

const ModalContext = createContext()

export default function Modal({ children }) {
  const [openName, setOpenName] = useState('')
  const close = () => setOpenName('')
  const open = setOpenName
  return <ModalContext value={{ openName, close, open }}>{children}</ModalContext>
}

Modal.Open = function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext)
  return cloneElement(children, { onClick: () => open(opensWindowName) })
}

Modal.Content = function Content({ children, name }) {
  const { openName, close } = useContext(ModalContext)
  const ref = useClickOutside(close)
  const showModal = openName === name

  return createPortal(
    <div
      className={`${showModal ? ' bg-backdrop-color pointer-events-auto backdrop-blur-xs' : ' pointer-events-none'} fixed top-0 right-0 size-full`}
    >
      <div
        className={`${showModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} fixed top-1/2 left-1/2 -translate-1/2 rounded-xl bg-white p-10 shadow-lg duration-300`}
        ref={ref}
      >
        <button onClick={close} className="duaration-300 absolute top-3 right-5 p-1 hover:bg-gray-100">
          <HiXMark />
        </button>
        {cloneElement(children, { onCloseModal: close, key: showModal ? name + '-open' : name + '-closed' })}
      </div>
    </div>,
    document.body,
  )
}
