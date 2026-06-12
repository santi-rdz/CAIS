import { cn } from '@lib/utils'

const SI_NO = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
]

// Control segmentado (por defecto Sí/No). Pill sobre track gris con el segmento
// activo en blanco — consistente con el Tab secundario de la app. Reemplaza el
// par de radios para una entrada binaria más clara y moderna.
export default function SegmentedToggle({ value, onChange, options = SI_NO, className }) {
  return (
    <div
      role="radiogroup"
      className={cn('inline-flex shrink-0 gap-0.5 rounded-lg bg-gray-100 p-0.5', className)}
    >
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'text-5 cursor-pointer rounded-md px-3.5 py-1 font-medium transition duration-150 ease-out active:scale-[0.97]',
              active ? 'bg-white text-green-800 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
