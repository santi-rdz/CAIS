export default function AreaSwitcher({ areas, activeArea, onChange }) {
  return (
    <div className="mt-5 inline-flex rounded-lg bg-gray-100 p-1">
      {areas.map(({ area, label }) => {
        const isActive = area === activeArea
        return (
          <button
            key={area}
            type="button"
            onClick={() => onChange(area)}
            aria-pressed={isActive}
            className={`text-5 cursor-pointer rounded-md px-4 py-1.5 font-medium duration-300 ${
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
