import {
  HiOutlineBeaker,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import DataField from '../../components/DataField'

export default function ConsultaSection({ historia }) {
  const {
    tipo_sangre,
    vacunas_infancia_completas,
    motivo_consulta,
    historia_enfermedad_actual,
  } = historia

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tipo_sangre && (
          <span className="text-6 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 font-medium text-red-700">
            <HiOutlineBeaker size={12} />
            Tipo de sangre: {tipo_sangre}
          </span>
        )}
        {vacunas_infancia_completas !== null &&
          vacunas_infancia_completas !== undefined && (
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
      <DataField label="Motivo de consulta" value={motivo_consulta} multiline />
      <DataField
        label="Historia de enfermedad actual"
        value={historia_enfermedad_actual}
        multiline
      />
    </div>
  )
}
