const PY = {
  6: 'py-(--mpy)',
  8: 'py-8',
  10: 'py-6',
}

export default function ModalBody({ children, py = 6, className = '' }) {
  const pyClass = PY[py] ?? 'py-(--mpy)'
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto px-(--mpx) ${pyClass} ${className}`}
    >
      {children}
    </div>
  )
}
