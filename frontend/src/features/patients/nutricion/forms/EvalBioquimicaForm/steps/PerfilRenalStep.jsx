import Heading from '@components/Heading'
import ProfileFieldsGrid from '@features/patients/nutricion/forms/EvalBioquimicaForm/ProfileFieldsGrid'
import { PERFIL_RENAL_FIELDS } from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

export default function PerfilRenalStep() {
  return (
    <div className="space-y-5">
      <Heading as="h4" showBar>
        Perfil Renal y Electrólitos
      </Heading>
      <ProfileFieldsGrid fields={PERFIL_RENAL_FIELDS} prefix="perfil_renal_electrolitos" />
    </div>
  )
}
