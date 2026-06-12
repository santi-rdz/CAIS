import { HiOutlineUser, HiOutlineIdentification, HiOutlinePhone } from 'react-icons/hi2'
import Heading from '@ui/components/Heading'
import { formatPhone } from '@lib/utils'

function getInitials(name) {
  if (!name) return null
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || null
  )
}

export default function PatientCard({ emergency }) {
  const { nombre, matricula, telefono } = emergency
  const initials = getInitials(nombre)
  const telDigits = telefono ? String(telefono).replace(/\D/g, '') : ''

  return (
    <section className="shadow-card rounded-2xl border border-gray-100 bg-white p-6">
      <Heading as="h3" showBar>
        Paciente
      </Heading>

      {/* Identidad */}
      <div className="mt-5 flex items-center gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold tracking-tight text-green-800 select-none">
          {initials ?? <HiOutlineUser size={22} />}
        </div>
        <div className="min-w-0">
          <p
            className={`text-3 font-lato font-medium ${nombre ? 'text-zinc-800' : 'text-zinc-400'}`}
          >
            {nombre || 'Sin identificar'}
          </p>
          <p className="text-6 mt-1 flex items-center gap-1 text-zinc-400">
            <HiOutlineIdentification size={12} />
            {matricula ? (
              <span className="tracking-wide tabular-nums">{matricula}</span>
            ) : (
              <span className="text-zinc-300">Sin matrícula</span>
            )}
          </p>
        </div>
      </div>

      {/* Contacto — accionable para llamar en una emergencia */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        {telDigits ? (
          <a
            href={`tel:${telDigits}`}
            aria-label={`Llamar al paciente al ${formatPhone(telefono)}`}
            className="group flex items-center gap-2.5 text-zinc-700 transition-colors duration-150 ease-out hover:text-green-800 active:scale-[0.99]"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-zinc-400 transition-colors duration-150 group-hover:bg-green-50 group-hover:text-green-700">
              <HiOutlinePhone size={14} />
            </span>
            <span className="text-4 font-medium tracking-tight">{formatPhone(telefono)}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2.5 text-zinc-300">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
              <HiOutlinePhone size={14} />
            </span>
            <span className="text-5">Sin teléfono</span>
          </div>
        )}
      </div>
    </section>
  )
}
