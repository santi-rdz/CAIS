import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { groupByFoodGroup } from '@features/patients/nutricion/constants'

// Resumen por grupos del SMAE: cuántos alimentos registrados hay de cada grupo.
export default function GruposResumen({ comidas = [] }) {
  const grupos = groupByFoodGroup(comidas)

  if (grupos.length === 0) {
    return (
      <p className="text-6 flex items-center gap-1.5 text-zinc-400">
        <HiOutlineSquares2X2 size={15} />
        Sin grupos registrados aún.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {grupos.map(({ grupo, count }) => (
        <span
          key={grupo}
          className="text-5 flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 py-1 pr-1 pl-2.5 font-medium text-teal-700"
        >
          {grupo}
          <span className="text-6 flex size-5 items-center justify-center rounded-md bg-teal-600 font-semibold text-white">
            {count}
          </span>
        </span>
      ))}
    </div>
  )
}
