export default function AreaSwitcher({ areas, activeArea, onChange }) {
  // Una sola área: indicador estático en vez de un botón que no alterna nada.
  const single = areas.length === 1
  const base = 'text-5 rounded-md px-4 py-1.5 font-medium'

  return (
    <div className="mt-5 inline-flex rounded-lg bg-gray-100 p-1">
      {areas.map(({ area, label }) => {
        const isActive = area === activeArea

        if (single) {
          return (
            <span key={area} className={`${base} bg-white text-green-800 shadow-sm`}>
              {label}
            </span>
          )
        }

        return (
          <button
            key={area}
            type="button"
            onClick={() => onChange(area)}
            aria-pressed={isActive}
            className={`${base} cursor-pointer duration-300 ${
              isActive ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
