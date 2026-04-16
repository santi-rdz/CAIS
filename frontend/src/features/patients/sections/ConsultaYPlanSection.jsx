import Heading from '@components/Heading'
import DataField from '@components/DataField'
import MotivoConsultaSection from './MotivoConsultaSection'
import PlanEstudioSection from './PlanEstudioSection'

export default function ConsultaYPlanSection({ historia }) {
  const { motivo_consulta, historia_enfermedad_actual, planes_estudio } =
    historia

  return (
    <div className="space-y-6">
      <MotivoConsultaSection motivo_consulta={motivo_consulta}>
        {historia_enfermedad_actual && (
          <DataField
            label="Historia de enfermedad actual"
            value={historia_enfermedad_actual}
            multiline
            block
          />
        )}
      </MotivoConsultaSection>

      <div className="space-y-3">
        <Heading as="h4" showBar>
          Plan y Diagnóstico
        </Heading>
        <PlanEstudioSection plan={planes_estudio} />
      </div>
    </div>
  )
}
