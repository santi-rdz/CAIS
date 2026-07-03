import Heading from '@components/Heading'
import Divider from '@components/Divider'
import ProfileFieldsGrid from '@features/patients/nutricion/forms/EvalBioquimicaForm/ProfileFieldsGrid'
import {
  PERFIL_LIPIDOS_FIELDS,
  BALANCE_ACIDO_BASE_FIELDS,
} from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

export default function LipidosAcidoBaseStep() {
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <Heading as="h4" showBar>
          Perfil de Lípidos
        </Heading>
        <ProfileFieldsGrid fields={PERFIL_LIPIDOS_FIELDS} prefix="perfil_lipidos" />
      </div>

      <Divider />

      <div className="space-y-4">
        <Heading as="h4" showBar>
          Balance Ácido-Base
        </Heading>
        <ProfileFieldsGrid fields={BALANCE_ACIDO_BASE_FIELDS} prefix="balance_acido_base" />
      </div>
    </div>
  )
}
