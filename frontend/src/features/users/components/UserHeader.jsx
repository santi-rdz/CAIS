import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'
import dayjs from 'dayjs'
import Heading from '@components/Heading'
import Tag from '@components/Tag'
import Tab from '@components/Tab'
import MetaChip from '@components/MetaChip'
import UserAvatar from '@components/UserAvatar'
import { formatFechaLong } from '@lib/dateHelpers'

const ROL_LABELS = {
  coordinador: 'Coordinador',
  pasante: 'Pasante',
  admin: 'Admin',
}

export default function UserHeader({ user }) {
  const { nombre, apellidos, fecha_nacimiento, correo, telefono, rol, estado, foto } = user

  const fullName = [nombre, apellidos].filter(Boolean).join(' ')

  const parsedBirthDate = fecha_nacimiento ? dayjs(fecha_nacimiento) : null
  const age =
    parsedBirthDate?.isValid() && parsedBirthDate.isBefore(dayjs())
      ? dayjs().diff(parsedBirthDate, 'year')
      : null

  const subtitle = [
    age != null && `${age} años`,
    fecha_nacimiento && formatFechaLong(fecha_nacimiento),
  ]
    .filter(Boolean)
    .join(' · ')

  const rolLabel = ROL_LABELS[rol?.toLowerCase()] ?? rol
  const estadoLower = estado?.toLowerCase()

  return (
    <div className="shadow-card rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-start gap-5">
        <UserAvatar
          nombre={nombre}
          apellidos={apellidos}
          foto={foto}
          size="lg"
          className="bg-blue-100 font-semibold tracking-tight text-blue-800"
        />

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
              {correo && <MetaChip icon={<HiOutlineEnvelope size={12} />} value={correo} />}
              {telefono && <MetaChip icon={<HiOutlinePhone size={12} />} value={telefono} />}
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
      </Tab.List>
    </div>
  )
}
