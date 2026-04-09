import {
  cloneElement,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { HiXMark } from 'react-icons/hi2'
import useClickOutside from '@hooks/useClickOutside'
import Heading from './Heading'

const ModalContext = createContext()
const ContentContext = createContext({ variant: 'default', icon: null })

export default function Modal({ children }) {
  const [openName, setOpenName] = useState('')
  return (
    <ModalContext.Provider
      value={{
        openName,
        close: () => setOpenName(''),
        open: setOpenName,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

Modal.Heading = function ModalHeadingComp({ children }) {
  const { variant, icon } = useContext(ContentContext)
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
    <header className="space-y-1 border-b border-b-neutral-200 px-(--mpx) py-(--mpy)">
      {children}
    </header>
  )
}

Modal.Title = function ModalTitleComp({ children }) {
  const { variant } = useContext(ContentContext)
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

const HEIGHTS = {
  70: 'h-[70vh] max-h-[70vh] max-sm:h-[95dvh] max-sm:max-h-[95dvh]',
  80: 'h-[80vh] max-h-[80vh] max-sm:h-[95dvh] max-sm:max-h-[95dvh]',
  90: 'h-[90vh] max-h-[90vh] max-sm:h-[95dvh] max-sm:max-h-[95dvh]',
}

Modal.Content = function Content({
  children,
  name,
  noPadding = false,
  size = 'md',
  height = 80,
  variant = 'default',
  icon,
}) {
  const { openName, close } = useContext(ModalContext)
  const ref = useClickOutside(
    close,
    true,
    '[class*="MuiPickers"], [class*="MuiDateCalendar"], [data-datepicker-calendar], [data-timepicker-clock], [data-dropdown-panel]'
  )

  const dragStartY = useRef(null)
  const scrollRef = useRef(null)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  function onTouchStart(e) {
    dragStartY.current = e.touches[0].clientY
  }

  function onTouchMove(e) {
    if (dragStartY.current === null) return
    const delta = e.touches[0].clientY - dragStartY.current
    const atTop = !scrollRef.current || scrollRef.current.scrollTop === 0
    if (delta > 0 && atTop) {
      setIsDragging(true)
      setDragY(delta)
    }
  }

  function onTouchEnd() {
    if (dragY > 120) {
      close()
    }
    setDragY(0)
    setIsDragging(false)
    dragStartY.current = null
  }

  if (openName !== name) return null

  const isAlert = variant === 'alert'
  const sizeClass = isAlert
    ? 'w-fit'
    : ({ sm: 'w-lg', md: 'w-2xl', lg: 'w-3xl', xl: 'w-4xl' }[size] ?? 'w-2xl')
  const heightClass = isAlert ? 'h-fit' : (HEIGHTS[height] ?? HEIGHTS[80])

  return createPortal(
    <ContentContext.Provider value={{ variant, icon }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 max-sm:items-end max-sm:p-0">
        <div
          ref={ref}
          className={`relative flex ${heightClass} ${sizeClass} flex-col overflow-hidden rounded-xl bg-white shadow-xl [--mpx:2rem] [--mpy:1rem] max-sm:w-full max-sm:self-end max-sm:rounded-b-none max-sm:[--mpx:1.25rem] max-sm:[--mpy:0.6rem]`}
          style={{
            transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Drag handle — mobile only */}
          <div className="hidden flex-col items-center pt-3 pb-1 max-sm:flex">
            <div className="h-1 w-10 rounded-full bg-zinc-300" />
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Cerrar modal"
            className="absolute top-4 right-5 z-20 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 max-sm:top-3 max-sm:right-3"
          >
            <HiXMark className="size-5" />
          </button>
          <div
            ref={scrollRef}
            className={`flex min-h-0 flex-1 flex-col ${noPadding ? '' : 'overflow-y-auto px-(--mpx) py-(--mpy)'}`}
          >
            {cloneElement(children, { onCloseModal: close })}
          </div>
        </div>
      </div>
    </ContentContext.Provider>,
    document.body
  )
}
