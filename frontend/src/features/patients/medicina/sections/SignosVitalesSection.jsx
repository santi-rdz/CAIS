import SubSection from '@features/patients/shared/sections/SubSection'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'

const IMC_LEVELS = [
  { max: 18.5, label: 'Bajo peso', color: 'border-blue-100 bg-blue-50 text-blue-700' },
  { max: 24.9, label: 'Normal', color: 'border-green-100 bg-green-50 text-green-700' },
  { max: 29.9, label: 'Sobrepeso', color: 'border-yellow-100 bg-yellow-50 text-yellow-700' },
  { max: Infinity, label: 'Obesidad', color: 'border-red-100 bg-red-50 text-red-700' },
]

function ImcBadge({ imc }) {
  const level = IMC_LEVELS.find((l) => parseFloat(imc) <= l.max)
  return (
    <span
      className={`text-7 ml-2 inline-flex items-center rounded-full border px-2 py-px font-medium ${level.color}`}
    >
      {level.label}
    </span>
  )
}

// Valor "número + unidad" (unidad tenue), o '' si no hay dato.
function metric(value, unit) {
  if (value == null || value === '') return ''
  return (
    <span>
      {value}
      <span className="ml-1 text-zinc-400">{unit}</span>
    </span>
  )
}

export default function SignosVitalesSection({ info }) {
  info ??= {}

  const imc =
    info.peso && info.altura ? (info.peso / Math.pow(info.altura / 100, 2)).toFixed(1) : null
  const pa =
    info.pa_sistolica && info.pa_diastolica ? `${info.pa_sistolica}/${info.pa_diastolica}` : null

  const antropometria = [
    { label: 'Peso', value: metric(info.peso, 'kg') },
    { label: 'Altura', value: metric(info.altura, 'cm') },
    {
      label: 'IMC',
      value: imc ? (
        <span>
          {imc}
          <span className="ml-1 text-zinc-400">kg/m²</span>
          <ImcBadge imc={imc} />
        </span>
      ) : (
        ''
      ),
    },
    { label: 'Glucosa capilar', value: metric(info.glucosa_capilar, 'mg/dL') },
    { label: 'Circ. cintura', value: metric(info.circ_cintura, 'cm') },
    { label: 'Circ. cadera', value: metric(info.circ_cadera, 'cm') },
  ]

  const vitales = [
    { label: 'Presión arterial', value: pa ? metric(pa, 'mmHg') : '' },
    { label: 'Frecuencia cardíaca', value: metric(info.fc, 'lpm') },
    { label: 'Frecuencia respiratoria', value: metric(info.fr, 'rpm') },
    { label: 'SpO₂', value: metric(info.sp_o2, '%') },
    { label: 'Temperatura', value: metric(info.temperatura, '°C') },
  ]

  const exploracion = [
    { label: 'Exploración física', value: info.exploracion_fisica },
    { label: 'Hábito exterior', value: info.habito_exterior },
  ]

  return (
    <div className="space-y-6">
      <SubSection title="Antropometría">
        <FieldsSection fields={antropometria} cols={3} />
      </SubSection>
      <SubSection title="Signos vitales">
        <FieldsSection fields={vitales} cols={3} />
      </SubSection>
      <SubSection title="Exploración">
        <FieldsSection fields={exploracion} cols={1} />
      </SubSection>
    </div>
  )
}
