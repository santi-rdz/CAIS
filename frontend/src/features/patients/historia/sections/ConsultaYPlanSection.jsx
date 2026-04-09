import Heading from '@components/Heading'
import DataField from '../../components/DataField'
import PlanEstudioSection from './PlanEstudioSection'

export default function ConsultaYPlanSection({ historia }) {
  const { motivo_consulta, historia_enfermedad_actual, planes_estudio } =
    historia

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Heading as="h4" showBar>
          Motivo de Consulta
        </Heading>
        <div className="flex flex-col gap-4">
          <DataField
            label="Motivo de consulta"
            value={motivo_consulta}
            multiline
            block
          />
          <DataField
            label="Historia de enfermedad actual"
            value={historia_enfermedad_actual}
            multiline
            block
          />
        </div>
      </div>

      <div className="space-y-3">
        <Heading as="h4" showBar>
          Plan y Diagnóstico
        </Heading>
        <PlanEstudioSection plan={planes_estudio} />
      </div>
    </div>
  )
}
