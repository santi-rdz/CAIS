import DataField from '../../components/DataField'
import Empty from '../components/Empty'

function VitalGroup({ label, children }) {
  return (
    <div>
      <p className="text-6 mb-2 font-medium uppercase tracking-widest text-zinc-300">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{children}</div>
    </div>
  )
}

function VitalStat({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="text-6 font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="text-3 mt-1 font-lato font-semibold text-zinc-800">
        {value != null ? (
          <>
            {value}
            {unit && <span className="text-6 ml-1 font-normal text-zinc-400">{unit}</span>}
          </>
        ) : (
          <span className="text-5 font-normal text-zinc-300">—</span>
        )}
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
    <div className="space-y-6">
      <VitalGroup label="Hemodinámica">
        <VitalStat label="Presión arterial" value={pa} unit="mmHg" />
        <VitalStat label="Frec. cardíaca" value={info.fc} unit="lpm" />
      </VitalGroup>
      <VitalGroup label="Respiratoria">
        <VitalStat label="Frec. respiratoria" value={info.fr} unit="rpm" />
        <VitalStat label="SpO₂" value={info.sp_o2} unit="%" />
        <VitalStat label="Temperatura" value={info.temperatura} unit="°C" />
      </VitalGroup>
      <VitalGroup label="Antropométrica">
        <VitalStat label="Peso" value={info.peso} unit="kg" />
        <VitalStat label="Altura" value={info.altura ? `${info.altura} m` : null} unit="" />
        <VitalStat label="IMC" value={imc} unit="kg/m²" />
        <VitalStat label="Glucosa" value={info.glucosa_capilar} unit="mg/dL" />
        <VitalStat label="Circ. cintura" value={info.circ_cintura} unit="cm" />
        <VitalStat label="Circ. cadera" value={info.circ_cadera} unit="cm" />
      </VitalGroup>
      {(info.exploracion_fisica || info.habito_exterior) && (
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <DataField label="Exploración física" value={info.exploracion_fisica} multiline />
          <DataField label="Hábito exterior" value={info.habito_exterior} multiline />
        </div>
      )}
    </div>
  )
}
