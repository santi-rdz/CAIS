import { HiOutlineCheckCircle, HiOutlineMinusCircle } from 'react-icons/hi2'
import { formatFecha } from '@lib/dateHelpers'
import SubSection from '@features/patients/shared/sections/SubSection'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import CheckGrid from '@features/patients/medicina/sections/CheckGrid'

const SERVICIOS = [
  { label: 'Gas', key: 'gas' },
  { label: 'Luz', key: 'luz' },
  { label: 'Agua', key: 'agua' },
  { label: 'Drenaje', key: 'drenaje' },
  { label: 'Cable / Teléfono', key: 'cable_tel' },
  { label: 'Internet', key: 'internet' },
]

const VACUNAS = [
  { label: 'Influenza', key: 'influenza' },
  { label: 'Tétanos', key: 'tetanos' },
  { label: 'Hepatitis B', key: 'hepatitis_b' },
  { label: 'COVID-19', key: 'covid_19' },
]

export default function NoPatologicosSection({ historia }) {
  const {
    tipo_sangre,
    vacunas_infancia_completas,
    inmunizaciones,
    servicios,
    antecedentes_no_patologicos: ant,
  } = historia
  const inm = inmunizaciones ?? {}

  const flags = [
    { label: 'Alimentación adecuada', value: ant?.alimentacion_adecuada ?? null },
    { label: 'Inmunizaciones completas', value: ant?.inmunizaciones_completas ?? null },
    { label: 'Zoonosis', value: ant?.zoonosis ?? null },
    { label: 'Vacunas de infancia completas', value: vacunas_infancia_completas ?? null },
  ]

  const textFields = [
    { label: 'Tipo de sangre', value: tipo_sangre },
    { label: 'Calidad y cantidad de alimentación', value: ant?.calidad_cantidad_alimentacion },
    { label: 'Higiene adecuada', value: ant?.higiene_adecuada },
    { label: 'Actividad física', value: ant?.actividad_fisica },
    { label: 'Tipo de zoonosis', value: ant?.tipo_zoonosis },
  ]

  const serviciosItems = SERVICIOS.map(({ label, key }) => ({
    label,
    value: servicios?.[key] ?? null,
  }))

  return (
    <div className="space-y-6">
      <SubSection title="Antecedentes no patológicos">
        <div className="space-y-4">
          <CheckGrid items={flags} />
          <FieldsSection fields={textFields} cols={2} />
        </div>
      </SubSection>

      <SubSection title="Servicios del hogar">
        <CheckGrid items={serviciosItems} />
      </SubSection>

      <SubSection title="Inmunizaciones">
        <div className="flex flex-wrap gap-x-8 gap-y-2.5">
          {VACUNAS.map(({ label, key }) => {
            const date = inm[key]
            return (
              <div key={key} className="flex items-center gap-2">
                {date ? (
                  <HiOutlineCheckCircle size={16} className="shrink-0 text-green-600" />
                ) : (
                  <HiOutlineMinusCircle size={16} className="shrink-0 text-zinc-400" />
                )}
                <span className={`text-5 ${date ? 'text-zinc-700' : 'text-zinc-400'}`}>
                  {label}
                </span>
                {date && <span className="text-6 text-zinc-400">· {formatFecha(date)}</span>}
              </div>
            )
          })}
        </div>
        {inm.otros && (
          <div className="mt-4">
            <FieldsSection fields={[{ label: 'Otras', value: inm.otros }]} cols={1} />
          </div>
        )}
      </SubSection>
    </div>
  )
}
