import {
  HiOutlineBeaker,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import Heading from '@components/Heading'
import DataField from '../../components/DataField'
import InmunizacionesSection from './InmunizacionesSection'

const SERVICIOS_ITEMS = [
  { label: 'Gas', key: 'gas' },
  { label: 'Luz', key: 'luz' },
  { label: 'Agua', key: 'agua' },
  { label: 'Drenaje', key: 'drenaje' },
  { label: 'Cable / Teléfono', key: 'cable_tel' },
  { label: 'Internet', key: 'internet' },
]

const ANTECEDENTES_ITEMS = [
  {
    key: 'alimentacion_adecuada',
    labelTrue: 'Buena alimentación',
    labelFalse: 'Mala alimentación',
  },
  {
    key: 'inmunizaciones_completas',
    labelTrue: 'Inmunizaciones completas',
    labelFalse: 'Inmunizaciones incompletas',
  },
  {
    key: 'zoonosis',
    labelTrue: 'Con zoonosis',
    labelFalse: 'Sin zoonosis',
  },
]

function StatusChip({ active, children, size = 'sm' }) {
  const sizeClasses = size === 'sm' ? 'text-6 px-3 py-1' : 'text-5 px-4 py-2'
  const iconSize = size === 'sm' ? 12 : 14
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${
        active
          ? 'border-green-100 bg-green-50 text-green-700'
          : 'border-zinc-200 bg-zinc-100 text-zinc-400'
      }`}
    >
      {active ? (
        <HiOutlineCheckCircle size={iconSize} />
      ) : (
        <HiOutlineXCircle size={iconSize} />
      )}
      {children}
    </span>
  )
}

export default function NoPatologicosSection({ historia }) {
  const {
    tipo_sangre,
    vacunas_infancia_completas,
    inmunizaciones,
    servicios,
    antecedentes_no_patologicos: antecedentes,
  } = historia

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
          <StatusChip active={vacunas_infancia_completas}>
            Vacunas {vacunas_infancia_completas ? 'completas' : 'incompletas'}
          </StatusChip>
        )}
        {antecedentes &&
          ANTECEDENTES_ITEMS.map(({ key, labelTrue, labelFalse }) => {
            if (antecedentes[key] == null) return null
            return (
              <StatusChip key={key} active={antecedentes[key]}>
                {antecedentes[key] ? labelTrue : labelFalse}
              </StatusChip>
            )
          })}
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
            {SERVICIOS_ITEMS.map(({ label, key }) => (
              <StatusChip key={key} active={servicios[key]} size="md">
                {label}
              </StatusChip>
            ))}
          </div>
        ) : (
          <p className="text-5 text-zinc-400">
            Sin servicios del hogar registrados.
          </p>
        )}
      </div>

      {/* Antecedentes no patologicos - Campos de texto */}
      <div className="space-y-3">
        <Heading as="h4" showBar>
          Antecedentes No Patológicos
        </Heading>
        <div className="space-y-3">
          <DataField
            label="Calidad y cantidad de alimentación"
            value={antecedentes?.calidad_cantidad_alimentacion}
            multiline
            block
          />
          <DataField
            label="Higiene adecuada"
            value={antecedentes?.higiene_adecuada}
            multiline
            block
          />
          <DataField
            label="Actividad física"
            value={antecedentes?.actividad_fisica}
            multiline
            block
          />
          <DataField
            label="Tipo de zoonosis"
            value={antecedentes?.tipo_zoonosis}
            multiline
            block
          />
        </div>
      </div>
    </div>
  )
}
