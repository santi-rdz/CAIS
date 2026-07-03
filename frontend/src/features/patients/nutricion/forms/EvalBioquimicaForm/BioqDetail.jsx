import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import Divider from '@components/Divider'
import Heading from '@components/Heading'
import { useTabStep } from '@hooks/useTabStep'
import { formatFecha } from '@lib/dateHelpers'
import BioqProfileFields from '@features/patients/nutricion/forms/EvalBioquimicaForm/BioqProfileFields'
import {
  PERFIL_ANEMIA_FIELDS,
  PERFIL_ENDOCRINO_FIELDS,
  PERFIL_RENAL_FIELDS,
  PERFIL_LIPIDOS_FIELDS,
  BALANCE_ACIDO_BASE_FIELDS,
  PERFIL_ORINA_FIELDS,
  PERFIL_INFLAMATORIO_Y_NUTRICION_FIELDS,
} from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

// Tab del detalle → step de EvalBioquimicaForm (mismo orden que STEPS ahí).
const TAB_TO_STEP = { hematologia: 0, renal: 1, lipidos: 2, orina: 3, inflamatorio: 4 }

export default function BioqDetail({ evaluation, onBack, onEdit, onDelete }) {
  const { activeTab, setActiveTab, initialStep } = useTabStep(TAB_TO_STEP, undefined, 'bioqTab')

  return (
    <div data-testid="bioq-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">Bioquímica</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">
            {formatFecha(evaluation.fecha ?? evaluation.creado_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label="Eliminar evaluación bioquímica"
            onClick={() => onDelete?.(evaluation)}
          >
            <HiOutlineTrash size={16} />
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="gap-1.5"
            onClick={() => onEdit?.(initialStep)}
          >
            <HiOutlinePencilSquare size={14} />
            Editar evaluación
          </Button>
        </div>
      </div>

      <Tab variant="underline" value={activeTab} onValueChange={setActiveTab}>
        <Tab.List>
          <Tab.Trigger value="hematologia">Hematología y Endócrino</Tab.Trigger>
          <Tab.Trigger value="renal">Perfil Renal</Tab.Trigger>
          <Tab.Trigger value="lipidos">Lípidos y Ácido-Base</Tab.Trigger>
          <Tab.Trigger value="orina">Perfil de Orina</Tab.Trigger>
          <Tab.Trigger value="inflamatorio">Estado Inflamatorio</Tab.Trigger>
        </Tab.List>

        <div className="space-y-5 pt-5">
          <Tab.Panel value="hematologia" scrollable={false}>
            <div className="space-y-5">
              <div className="space-y-4">
                <Heading as="h4" showBar>
                  Perfil de Anemia Nutricia
                </Heading>
                <BioqProfileFields
                  fields={PERFIL_ANEMIA_FIELDS}
                  prefix="perfil_anemia_nutricion"
                  evaluation={evaluation}
                />
              </div>
              <Divider />
              <div className="space-y-4">
                <Heading as="h4" showBar>
                  Perfil Endócrino
                </Heading>
                <BioqProfileFields
                  fields={PERFIL_ENDOCRINO_FIELDS}
                  prefix="perfil_endocrino"
                  evaluation={evaluation}
                />
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel value="renal" scrollable={false}>
            <BioqProfileFields
              fields={PERFIL_RENAL_FIELDS}
              prefix="perfil_renal_electrolitos"
              evaluation={evaluation}
            />
          </Tab.Panel>

          <Tab.Panel value="lipidos" scrollable={false}>
            <div className="space-y-5">
              <div className="space-y-4">
                <Heading as="h4" showBar>
                  Perfil de Lípidos
                </Heading>
                <BioqProfileFields
                  fields={PERFIL_LIPIDOS_FIELDS}
                  prefix="perfil_lipidos"
                  evaluation={evaluation}
                />
              </div>
              <Divider />
              <div className="space-y-4">
                <Heading as="h4" showBar>
                  Balance Ácido-Base
                </Heading>
                <BioqProfileFields
                  fields={BALANCE_ACIDO_BASE_FIELDS}
                  prefix="balance_acido_base"
                  evaluation={evaluation}
                />
              </div>
            </div>
          </Tab.Panel>

          <Tab.Panel value="orina" scrollable={false}>
            <BioqProfileFields
              fields={PERFIL_ORINA_FIELDS}
              prefix="perfil_orina"
              evaluation={evaluation}
            />
          </Tab.Panel>

          <Tab.Panel value="inflamatorio" scrollable={false}>
            <BioqProfileFields
              fields={PERFIL_INFLAMATORIO_Y_NUTRICION_FIELDS}
              evaluation={evaluation}
            />
          </Tab.Panel>
        </div>
      </Tab>
    </div>
  )
}
