import Heading from '@components/Heading'
import ProfileFieldsGrid from '@features/patients/nutricion/forms/EvalBioquimicaForm/ProfileFieldsGrid'
import { PERFIL_INFLAMATORIO_Y_NUTRICION_FIELDS } from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

export default function EstadoInflamatorioStep() {
  return (
    <div className="space-y-5">
      <Heading as="h4" showBar>
        Perfil Inflamatorio y Estado Nutricional
      </Heading>
      <ProfileFieldsGrid fields={PERFIL_INFLAMATORIO_Y_NUTRICION_FIELDS} />
    </div>
  )
}
