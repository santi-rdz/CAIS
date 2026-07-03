import Heading from '@components/Heading'
import ProfileFieldsGrid from '@features/patients/nutricion/forms/EvalBioquimicaForm/ProfileFieldsGrid'
import { PERFIL_ORINA_FIELDS } from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

export default function PerfilOrinaStep() {
  return (
    <div className="space-y-5">
      <Heading as="h4" showBar>
        Perfil de Orina
      </Heading>
      <ProfileFieldsGrid fields={PERFIL_ORINA_FIELDS} prefix="perfil_orina" />
    </div>
  )
}
