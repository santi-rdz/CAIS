import SubSection from '@features/patients/shared/sections/SubSection'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'

export default function MotivoConsultaSection({ fields }) {
  return (
    <SubSection title="Motivo de consulta">
      <FieldsSection fields={fields} cols={1} />
    </SubSection>
  )
}
