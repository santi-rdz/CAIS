import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiOutlineInformationCircle } from 'react-icons/hi2'

const WIDTH = 256
const MARGIN = 8

// Ícono de ayuda contextual: al hacer hover o foco muestra una nota breve. El
// popover se renderiza en un portal posicionado desde el rect del ícono, para que
// no lo recorte el overflow de la modal.
export default function InfoTooltip({ text, label = 'Más información' }) {
  const [coords, setCoords] = useState(null)
  const ref = useRef(null)
  if (!text) return null

  function open() {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const left = Math.min(rect.left, window.innerWidth - WIDTH - MARGIN)
    setCoords({ top: rect.bottom + 6, left: Math.max(MARGIN, left) })
  }

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className="cursor-help text-zinc-500 transition-colors hover:text-teal-600 focus-visible:text-teal-600 focus-visible:outline-none"
        onMouseEnter={open}
        onMouseLeave={() => setCoords(null)}
        onFocus={open}
        onBlur={() => setCoords(null)}
        onClick={(e) => e.preventDefault()}
      >
        <HiOutlineInformationCircle size={18} />
      </button>
      {coords &&
        createPortal(
          <span
            role="tooltip"
            style={{ top: coords.top, left: coords.left, width: WIDTH }}
            className="text-6 fixed z-[60] rounded-lg bg-zinc-800 px-3 py-2 leading-relaxed font-normal text-zinc-50 shadow-lg"
          >
            {text}
          </span>,
          document.body
        )}
    </>
  )
}
