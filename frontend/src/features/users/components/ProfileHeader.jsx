import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2'
import dayjs from 'dayjs'
import Heading from '@components/Heading'
import Tag from '@components/Tag'
import Tab from '@components/Tab'
import MetaChip from '@components/MetaChip'
import { formatFechaLong } from '@lib/dateHelpers'

const ROL_LABELS = {
  coordinador: 'Coordinador',
  pasante: 'Pasante',
  admin: 'Admin',
}

export default function ProfileHeader({ user }) {
  const {
    nombre,
    apellidos,
    fecha_nacimiento,
    correo,
    telefono,
    rol,
    estado,
    foto,
  } = user

  const fullName = [nombre, apellidos].filter(Boolean).join(' ')

  const parsedBirthDate = fecha_nacimiento ? dayjs(fecha_nacimiento) : null
  const age =
    parsedBirthDate?.isValid() && parsedBirthDate.isBefore(dayjs())
      ? dayjs().diff(parsedBirthDate, 'year')
      : null

  const initials =
    [nombre, apellidos]
      .filter(Boolean)
      .map((s) => s[0].toUpperCase())
      .join('')
      .slice(0, 2) || null

  const subtitle = [
    age != null && `${age} años`,
    fecha_nacimiento && formatFechaLong(fecha_nacimiento),
  ]
    .filter(Boolean)
    .join(' · ')

  const rolLabel = ROL_LABELS[rol?.toLowerCase()] ?? rol
  const estadoLower = estado?.toLowerCase()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-5">
        <div className="relative shrink-0">
          {foto ? (
            <img
              src={foto}
              alt={fullName || nombre}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold tracking-tight text-blue-800 select-none">
              {initials ?? <HiOutlineUser size={24} />}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Heading as="h2">{fullName || '---'}</Heading>
            {rolLabel && (
              <Tag type="pendiente" size="sm">
                {rolLabel}
              </Tag>
            )}
            {estadoLower && (
              <Tag type={estadoLower} size="sm">
                {estadoLower}
              </Tag>
            )}
          </div>
          {subtitle && <p className="text-5 mt-1 text-zinc-400">{subtitle}</p>}
          {(correo || telefono) && (
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
            </div>
          )}
        </div>
      </div>

      <Tab.List className="mt-5">
        <Tab.Trigger value="info">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlineIdentification size={13} />
            Información
          </span>
        </Tab.Trigger>
        <Tab.Trigger value="actividad">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlineClipboardDocumentList size={13} />
            Actividad reciente
          </span>
        </Tab.Trigger>
        <Tab.Trigger value="configuracion">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlineCog6Tooth size={13} />
            Configuración
          </span>
        </Tab.Trigger>
      </Tab.List>
    </div>
  )
}
