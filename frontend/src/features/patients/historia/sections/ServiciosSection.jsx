import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'
import Empty from '../components/Empty'

const SERVICIOS_ITEMS = [
  { label: 'Gas', key: 'gas' },
  { label: 'Luz', key: 'luz' },
  { label: 'Agua', key: 'agua' },
  { label: 'Drenaje', key: 'drenaje' },
  { label: 'Cable / Teléfono', key: 'cable_tel' },
  { label: 'Internet', key: 'internet' },
]

export default function ServiciosSection({ servicios }) {
  if (!servicios) return <Empty />

  return (
    <div className="flex flex-wrap gap-2">
      {SERVICIOS_ITEMS.map(({ label, key }) => {
        const active = servicios[key]
        return (
          <span
            key={key}
            className={`text-5 inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-medium ${
              active
                ? 'border-green-100 bg-green-50 text-green-700'
                : 'border-zinc-200 bg-zinc-100 text-zinc-400'
            }`}
          >
            {active ? <HiOutlineCheckCircle size={14} /> : <HiOutlineXCircle size={14} />}
            {label}
          </span>
        )
      })}
    </div>
  )
}
