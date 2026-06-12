import SubSection from '@features/patients/shared/sections/SubSection'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import BadgeList from '@features/patients/medicina/sections/BadgeList'

export default function PlanEstudioSection({ plan }) {
  const { cie10_codes, plan_tratamiento, tratamiento, estudios_complementarios } = plan ?? {}

  const planFields = [
    { label: 'Plan de tratamiento', value: plan_tratamiento },
    { label: 'Tratamiento', value: tratamiento },
    { label: 'Estudios complementarios', value: estudios_complementarios },
  ]

  const cieBadges = (cie10_codes ?? []).map((c) => ({ label: c.codigo, sub: c.descripcion }))

  return (
    <div className="space-y-6">
      <SubSection title="Plan y tratamiento">
        <FieldsSection fields={planFields} cols={1} />
      </SubSection>
      <SubSection title="Diagnóstico (CIE-10)">
        <BadgeList items={cieBadges} />
      </SubSection>
    </div>
  )
}
