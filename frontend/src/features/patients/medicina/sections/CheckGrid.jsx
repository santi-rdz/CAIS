import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineMinusCircle } from 'react-icons/hi2'

// Booleanos legibles de un vistazo (servicios, antecedentes Sí/No). value:
// true → check verde, false → x, null/undefined → guion (sin registro).
function CheckItem({ label, value }) {
  let icon
  let labelColor
  if (value === true) {
    icon = <HiOutlineCheckCircle size={16} className="shrink-0 text-green-600" />
    labelColor = 'text-zinc-700'
  } else if (value === false) {
    icon = <HiOutlineXCircle size={16} className="shrink-0 text-zinc-500" />
    labelColor = 'text-zinc-600'
  } else {
    icon = <HiOutlineMinusCircle size={16} className="shrink-0 text-zinc-400" />
    labelColor = 'text-zinc-400'
  }

  return (
    <div className="flex items-center gap-2 py-0.5">
      {icon}
      <span className={`text-5 ${labelColor}`}>{label}</span>
    </div>
  )
}

export default function CheckGrid({ items }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2.5">
      {items.map((it) => (
        <CheckItem key={it.label} label={it.label} value={it.value} />
      ))}
    </div>
  )
}
