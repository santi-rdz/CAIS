import { formatFechaLong, formatHora } from '@lib/dateHelpers'
import Heading from '@ui/components/Heading'
import MetaChip from '@ui/components/MetaChip'
import Tag from '@ui/components/Tag'
import { HiOutlineClock, HiOutlineMapPin, HiOutlineUser } from 'react-icons/hi2'

export default function HeaderCard({ emergency }) {
  const { fecha_hora, ubicacion, recurrente, registrado_por } = emergency
  const fecha = formatFechaLong(fecha_hora)
  const hora = formatHora(fecha_hora)
  const registradoPor = registrado_por
    ? [registrado_por.nombre, registrado_por.apellidos].filter(Boolean).join(' ')
    : null

  return (
    <section className="shadow-card space-y-3 rounded-2xl border border-gray-100 bg-white p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-5 mb-1 text-neutral-400">Emergencia registrada</p>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <Heading as="h3">{fecha}</Heading>
            {hora && (
              <span className="text-4 inline-flex items-center gap-1 text-zinc-400">
                <HiOutlineClock size={13} />
                {hora}
              </span>
            )}
          </div>
        </div>
        {recurrente && (
          <Tag type="pendiente" size="sm">
            Recurrente
          </Tag>
        )}
      </header>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3.5">
        <MetaChip icon={<HiOutlineMapPin size={14} />} value={ubicacion} />
        {registradoPor && (
          <span className="text-6 flex items-center gap-1.5 text-zinc-400">
            <HiOutlineUser size={13} className="shrink-0" />
            <span>
              Registrado por <span className="font-medium text-zinc-600">{registradoPor}</span>
            </span>
          </span>
        )}
      </div>
    </section>
  )
}
