import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineClipboardDocument,
  HiOutlinePencilSquare,
} from 'react-icons/hi2'
import dayjs from 'dayjs'
import Heading from '@components/Heading'
import Tag from '@components/Tag'
import Tab from '@components/Tab'
import { formatFechaLong } from '@lib/dateHelpers'
import MetaChip from '@components/MetaChip'

export default function PatientHeader({ patient }) {
  const {
    nombre,
    fecha_nacimiento,
    genero,
    es_externo,
    correo,
    telefono,
    nss,
  } = patient

  const age = fecha_nacimiento
    ? dayjs().diff(dayjs(fecha_nacimiento), 'year')
    : null

  const initials = nombre
    ? nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : null

  const subtitle = [
    age != null && `${age} años`,
    fecha_nacimiento && formatFechaLong(fecha_nacimiento),
    genero,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold tracking-tight text-green-800 select-none">
          {initials ?? <HiOutlineUser size={24} />}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Heading as="h2">{nombre ?? '---'}</Heading>
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
                <MetaChip
                  icon={<HiOutlineEnvelope size={12} />}
                  value={correo}
                />
              )}
              {telefono && (
                <MetaChip
                  icon={<HiOutlinePhone size={12} />}
                  value={telefono}
                />
              )}
              {nss && (
                <MetaChip
                  icon={<HiOutlineIdentification size={12} />}
                  value={`NSS ${nss}`}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <Tab.List className="mt-5">
        <Tab.Trigger value="historia">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlineClipboardDocument size={13} />
            Historia médica
          </span>
        </Tab.Trigger>
        <Tab.Trigger value="notas">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlinePencilSquare size={13} />
            Notas de evolución
          </span>
        </Tab.Trigger>
        <Tab.Trigger value="datos">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlineIdentification size={13} />
            Datos personales
          </span>
        </Tab.Trigger>
      </Tab.List>
    </div>
  )
}
