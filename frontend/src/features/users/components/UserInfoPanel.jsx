import {
  HiOutlineIdentification,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCalendarDays,
} from 'react-icons/hi2'
import Heading from '@components/Heading'
import DataField from '@components/DataField'
import { formatFechaLong, formatFechaHora } from '@lib/dateHelpers'

function formatPeriodo(periodo) {
  if (!periodo) return null
  // e.g. "2024A" → "2024 — Periodo A"
  const match = periodo.match(/^(\d{4})([AB])$/)
  if (match) return `${match[1]} — Periodo ${match[2]}`
  return periodo
}

export default function UserInfoPanel({ user }) {
  const {
    correo,
    telefono,
    fecha_nacimiento,
    area,
    matricula,
    cedula,
    inicio_servicio,
    fin_servicio,
    creado_at,
    ultimo_acceso,
    rol,
  } = user

  const rolLower = rol?.toLowerCase()
  const isIntern = rolLower === 'pasante' || rolLower === 'interno'
  const isCoord = rolLower === 'coordinador'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Datos del usuario
      </Heading>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DataField
          icon={<HiOutlineBriefcase size={14} />}
          label="Área"
          value={area}
        />
        <DataField
          icon={<HiOutlineCalendarDays size={14} />}
          label="Fecha de nacimiento"
          value={fecha_nacimiento ? formatFechaLong(fecha_nacimiento) : null}
        />
        {isIntern && (
          <DataField
            icon={<HiOutlineIdentification size={14} />}
            label="Matrícula"
            value={matricula}
          />
        )}
        {isCoord && (
          <DataField
            icon={<HiOutlineIdentification size={14} />}
            label="Cédula profesional"
            value={cedula}
          />
        )}
        {isIntern && (
          <DataField
            icon={<HiOutlineAcademicCap size={14} />}
            label="Inicio de servicio"
            value={formatPeriodo(inicio_servicio)}
          />
        )}
        {isIntern && (
          <DataField
            icon={<HiOutlineAcademicCap size={14} />}
            label="Fin de servicio"
            value={formatPeriodo(fin_servicio)}
          />
        )}
        <DataField
          icon={<HiOutlineClock size={14} />}
          label="Miembro desde"
          value={creado_at ? formatFechaLong(creado_at) : null}
        />
        <DataField
          icon={<HiOutlineClock size={14} />}
          label="Último acceso"
          value={ultimo_acceso ? formatFechaHora(ultimo_acceso) : null}
        />
      </div>
    </div>
  )
}
