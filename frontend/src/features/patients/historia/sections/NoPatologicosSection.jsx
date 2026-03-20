import {
  HiOutlineBeaker,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import Heading from '@components/Heading'
import InmunizacionesSection from './InmunizacionesSection'
import Empty from '../components/Empty'

const SERVICIOS_ITEMS = [
  { label: 'Gas', key: 'gas' },
  { label: 'Luz', key: 'luz' },
  { label: 'Agua', key: 'agua' },
  { label: 'Drenaje', key: 'drenaje' },
  { label: 'Cable / Teléfono', key: 'cable_tel' },
  { label: 'Internet', key: 'internet' },
]

export default function NoPatologicosSection({ historia }) {
  const { tipo_sangre, vacunas_infancia_completas, inmunizaciones, servicios } =
    historia

  const hasData =
    tipo_sangre ||
    vacunas_infancia_completas != null ||
    inmunizaciones ||
    servicios
  if (!hasData) return <Empty />

  return (
    <div className="space-y-6">
      {/* Chips de resumen */}
      <div className="flex flex-wrap gap-2">
        {tipo_sangre && (
          <span className="text-6 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 font-medium text-red-700">
            <HiOutlineBeaker size={12} />
            Tipo de sangre: {tipo_sangre}
          </span>
        )}
        {vacunas_infancia_completas != null && (
          <span
            className={`text-6 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${
              vacunas_infancia_completas
                ? 'border-green-100 bg-green-50 text-green-700'
                : 'border-zinc-200 bg-zinc-100 text-zinc-500'
            }`}
          >
            {vacunas_infancia_completas ? (
              <HiOutlineCheckCircle size={12} />
            ) : (
              <HiOutlineXCircle size={12} />
            )}
            Vacunas {vacunas_infancia_completas ? 'completas' : 'incompletas'}
          </span>
        )}
      </div>

      {/* Inmunizaciones */}
      <div className="space-y-3">
        <Heading as="h4" showBar>
          Inmunizaciones
        </Heading>
        <InmunizacionesSection inm={inmunizaciones} />
      </div>

      {/* Servicios del hogar */}
      <div className="space-y-3">
        <Heading as="h4" showBar>
          Servicios del Hogar
        </Heading>
        {servicios ? (
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
                  {active ? (
                    <HiOutlineCheckCircle size={14} />
                  ) : (
                    <HiOutlineXCircle size={14} />
                  )}
                  {label}
                </span>
              )
            })}
          </div>
        ) : (
          <p className="text-5 text-zinc-300">—</p>
        )}
      </div>
    </div>
  )
}
