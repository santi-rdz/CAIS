import MotivoConsultaSection from '@features/patients/medicina/sections/MotivoConsultaSection'
import PlanEstudioSection from '@features/patients/medicina/sections/PlanEstudioSection'

export default function ConsultaYPlanSection({ historia }) {
  const { motivo_consulta, historia_enfermedad_actual, planes_estudio } = historia ?? {}

  return (
    <div className="space-y-6">
      <MotivoConsultaSection
        fields={[
          { label: 'Motivo de consulta', value: motivo_consulta },
          { label: 'Historia de la enfermedad actual', value: historia_enfermedad_actual },
        ]}
      />
      <PlanEstudioSection plan={planes_estudio} />
    </div>
  )
}
