import dayjs from 'dayjs'
import { HiCheck, HiOutlineArrowUturnLeft } from 'react-icons/hi2'
import { getInitials } from '@lib/utils'
import Button from '@components/Button'
import Tag from '@components/Tag'

export default function SyncedPatientBanner({ patient, onUndo }) {
  return (
    <section
      role="status"
      className="shadow-card animate-in fade-in slide-in-from-top-2 mb-6 flex items-center gap-4 rounded-2xl border border-green-800/20 bg-gradient-to-r from-green-50/70 via-white to-white p-5 ring-1 ring-green-800/10 duration-300"
    >
      <span className="relative shrink-0">
        <span className="text-6 grid size-10 place-items-center rounded-full bg-green-100 font-medium text-green-800">
          {getInitials(patient.nombre, patient.apellidos)}
        </span>
        <span className="absolute -right-0.5 -bottom-0.5 grid size-4 place-items-center rounded-full bg-green-800 text-white ring-2 ring-white">
          <HiCheck size={10} strokeWidth={3} />
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-5 flex flex-wrap items-center gap-2 font-medium text-gray-800">
          <span className="truncate">
            {patient.nombre} {patient.apellidos}
          </span>
          <Tag type="activo" size="xs">
            Expediente vinculado
          </Tag>
        </div>
        <p className="text-6 mt-0.5 text-gray-500">
          {dayjs(patient.fecha_nacimiento).format('DD/MM/YYYY')} · {patient.genero} — los datos ya
          capturados se conservan del expediente; completa solo los campos propios de tu área.
        </p>
      </div>

      <Button size="sm" variant="ghost" onClick={onUndo}>
        <HiOutlineArrowUturnLeft size={14} />
        Deshacer
      </Button>
    </section>
  )
}
