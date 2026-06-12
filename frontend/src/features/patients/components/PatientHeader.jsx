import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineIdentification,
} from 'react-icons/hi2'
import dayjs from 'dayjs'
import Heading from '@components/Heading'
import Tag from '@components/Tag'
import Tab from '@components/Tab'
import { formatFechaLong } from '@lib/dateHelpers'
import { formatPhone } from '@lib/utils'
import MetaChip from '@components/MetaChip'

export default function PatientHeader({ patient, tabs }) {
  const { nombre, apellidos, fecha_nacimiento, genero, es_externo, correo, telefono, nss } = patient

  const fullName = [nombre, apellidos].filter(Boolean).join(' ')

  const age = fecha_nacimiento ? dayjs().diff(dayjs(fecha_nacimiento), 'year') : null

  const initials =
    [nombre, apellidos]
      .filter(Boolean)
      .map((s) => s[0].toUpperCase())
      .join('')
      .slice(0, 2) || null

  const subtitle = [
    age != null && `${age} años`,
    fecha_nacimiento && formatFechaLong(fecha_nacimiento),
    genero,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="shadow-card rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold tracking-tight text-green-800 select-none">
          {initials ?? <HiOutlineUser size={24} />}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Heading as="h2">{fullName || '---'}</Heading>
            {es_externo && (
              <Tag type="pendiente" size="sm">
                Externo
              </Tag>
            )}
          </div>
          {subtitle && <p className="text-5 mt-1 text-zinc-400">{subtitle}</p>}
          {(correo || telefono || nss) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {correo && (
                <a
                  href={`mailto:${correo}`}
                  aria-label={`Enviar correo a ${correo}`}
                  className="rounded-md transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  <MetaChip icon={<HiOutlineEnvelope size={12} />} value={correo} />
                </a>
              )}
              {telefono && (
                <a
                  href={`tel:${String(telefono).replace(/\D/g, '')}`}
                  aria-label={`Llamar al ${formatPhone(telefono)}`}
                  className="rounded-md transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  <MetaChip icon={<HiOutlinePhone size={12} />} value={formatPhone(telefono)} />
                </a>
              )}
              {nss && (
                <MetaChip icon={<HiOutlineIdentification size={12} />} value={`NSS ${nss}`} />
              )}
            </div>
          )}
        </div>
      </div>

      <Tab.List className="mt-5">
        {tabs.map((tab) => (
          <Tab.Trigger key={tab.value} value={tab.value}>
            <span className="inline-flex items-center justify-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </Tab.Trigger>
        ))}
      </Tab.List>
    </div>
  )
}
