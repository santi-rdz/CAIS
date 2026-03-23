import { HiOutlineDocumentText, HiOutlineUser } from 'react-icons/hi2'
import Empty from '../components/Empty'

function VitalStat({ label, value, unit, badge }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">
        {label}
      </p>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <p className="text-4 font-lato font-semibold text-zinc-800">
          {value != null ? (
            <>
              {value}
              {unit && (
                <span className="text-6 ml-1 font-normal text-zinc-400">
                  {unit}
                </span>
              )}
            </>
          ) : (
            <span className="text-5 font-normal text-zinc-300">—</span>
          )}
        </p>
        {badge}
      </div>
    </div>
  )
}

const IMC_LEVELS = [
  {
    max: 18.5,
    label: 'Bajo peso',
    color: 'border-blue-100 bg-blue-50 text-blue-700',
  },
  {
    max: 24.9,
    label: 'Normal',
    color: 'border-green-100 bg-green-50 text-green-700',
  },
  {
    max: 29.9,
    label: 'Sobrepeso',
    color: 'border-yellow-100 bg-yellow-50 text-yellow-700',
  },
  {
    max: Infinity,
    label: 'Obesidad',
    color: 'border-red-100 bg-red-50 text-red-700',
  },
]

function ImcBadge({ imc }) {
  if (!imc) return null
  const level = IMC_LEVELS.find((l) => parseFloat(imc) <= l.max)
  return (
    <span
      className={`text-6 inline-flex items-center rounded-full border px-2 py-px font-medium ${level.color}`}
    >
      {level.label}
    </span>
  )
}

function GroupLabel({ label }) {
  return (
    <p className="text-6 col-span-full font-semibold tracking-widest text-zinc-300 uppercase">
      {label}
    </p>
  )
}

function TextBlock({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-zinc-400" />
        <p className="text-6 font-semibold tracking-widest text-zinc-400 uppercase">
          {label}
        </p>
      </div>
      <p className="text-5 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 leading-relaxed whitespace-pre-wrap text-zinc-700">
        {value}
      </p>
    </div>
  )
}

export default function SignosVitalesSection({ info }) {
  if (!info) return <Empty />

  const imc =
    info.peso && info.altura
      ? (info.peso / (info.altura * info.altura)).toFixed(1)
      : null

  const pa =
    info.pa_sistolica && info.pa_diastolica
      ? `${info.pa_sistolica}/${info.pa_diastolica}`
      : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        <GroupLabel label="Signos vitales" />
        <VitalStat label="Presión arterial" value={pa} unit="mmHg" />
        <VitalStat label="Frec. cardíaca" value={info.fc} unit="lpm" />
        <VitalStat label="Frec. respiratoria" value={info.fr} unit="rpm" />
        <VitalStat label="SpO₂" value={info.sp_o2} unit="%" />
        <VitalStat label="Temperatura" value={info.temperatura} unit="°C" />

        <GroupLabel label="Antropométrica" />
        <VitalStat label="Peso" value={info.peso} unit="kg" />
        <VitalStat
          label="Altura"
          value={info.altura ? `${info.altura} m` : null}
          unit=""
        />
        <VitalStat
          label="IMC"
          value={imc}
          unit={imc ? 'kg/m²' : ''}
          badge={<ImcBadge imc={imc} />}
        />
        <VitalStat label="Glucosa" value={info.glucosa_capilar} unit="mg/dL" />
        <VitalStat label="Circ. cintura" value={info.circ_cintura} unit="cm" />
        <VitalStat label="Circ. cadera" value={info.circ_cadera} unit="cm" />
      </div>

      {(info.exploracion_fisica || info.habito_exterior) && (
        <div className="space-y-3 border-t border-gray-100 pt-3">
          <TextBlock
            icon={HiOutlineDocumentText}
            label="Exploración física"
            value={info.exploracion_fisica}
          />
          <TextBlock
            icon={HiOutlineUser}
            label="Hábito exterior"
            value={info.habito_exterior}
          />
        </div>
      )}
    </div>
  )
}
