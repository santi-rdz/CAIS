import Heading from '@components/Heading'
import DataField from '@components/DataField'
import CIE10List from './CIE10List'

export default function PlanEstudioSection({ plan }) {
  const { cie10_codes, plan_tratamiento, tratamiento, estudios_complementarios } = plan ?? {}
  return (
    <div className="space-y-6">
      <Heading as="h4" showBar>
        Plan y Diagnóstico
      </Heading>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DataField
          label="Plan de tratamiento"
          value={plan_tratamiento}
          multiline
          block
        />
        <DataField label="Tratamiento" value={tratamiento} multiline block />
      </div>

      <div className="space-y-3">
        <Heading as="h4" showBar>
          Estudios Complementarios
        </Heading>
        <DataField
          label="Estudios complementarios"
          value={estudios_complementarios}
          multiline
          block
        />
      </div>

      <CIE10List codes={cie10_codes} />
    </div>
  )
}
