import { formatFechaLong, formatHora } from '@lib/dateHelpers'
import Heading from '@ui/components/Heading'
import MetaChip from '@ui/components/MetaChip'
import Tag from '@ui/components/Tag'
import { HiOutlineClock, HiOutlineMapPin, HiOutlineUser } from 'react-icons/hi2'

export default function HeaderCard({ emergency }) {
  const { fecha_hora, ubicacion, recurrente, registrado_por } = emergency
  const fecha = formatFechaLong(fecha_hora)
  const hora = formatHora(fecha_hora)

  return (
    <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-5 mb-1 text-neutral-400">Emergencia registrada</p>
          <Heading as="h3">{fecha}</Heading>
        </div>
        {recurrente && (
          <Tag type="pendiente" size="sm">
            Recurrente
          </Tag>
        )}
      </header>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <MetaChip
          icon={<HiOutlineClock size={14} />}
          label="Hora"
          value={hora}
        />
        <MetaChip
          icon={<HiOutlineMapPin size={14} />}
          label="Ubicación"
          value={ubicacion}
        />
        {registrado_por && (
          <MetaChip
            icon={<HiOutlineUser size={14} />}
            label="Registrado por"
            value={registrado_por.nombre}
          />
        )}
      </div>
    </section>
  )
}
