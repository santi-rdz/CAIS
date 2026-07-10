import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import { useTabStep } from '@hooks/useTabStep'
import { formatFecha } from '@lib/dateHelpers'
import ApetitoSummary from '@features/patients/nutricion/forms/EvalNutricionalForm/ApetitoSummary'
import FrecuenciaSummary from '@features/patients/nutricion/forms/EvalNutricionalForm/FrecuenciaSummary'
import DietaHabitosSummary from '@features/patients/nutricion/forms/EvalNutricionalForm/DietaHabitosSummary'

// Tab del detalle → step de EvalNutricionalForm (mismo orden que STEPS ahí).
const TAB_TO_STEP = { dieta: 0, apetito: 1, frecuencia: 2, preferencias: 3 }

export default function NutrDetail({ evaluation, onBack, onEdit, onDelete }) {
  const { activeTab, setActiveTab, initialStep } = useTabStep(TAB_TO_STEP, undefined, 'nutrTab')

  return (
    <div data-testid="nutr-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">Evaluación nutricional</span>
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
            aria-label="Eliminar evaluación nutricional"
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
          <Tab.Trigger value="dieta">Dieta y Hábitos</Tab.Trigger>
          <Tab.Trigger value="apetito">Evaluación de Apetito</Tab.Trigger>
          <Tab.Trigger value="frecuencia">Frecuencia de Consumo</Tab.Trigger>
          <Tab.Trigger value="preferencias">Preferencias</Tab.Trigger>
        </Tab.List>

        <div className="space-y-5 pt-5">
          <Tab.Panel value="dieta" scrollable={false}>
            <DietaHabitosSummary evaluation={evaluation} />
          </Tab.Panel>

          <Tab.Panel value="apetito" scrollable={false}>
            <ApetitoSummary apetito={evaluation.eval_apetito_nutricion} />
          </Tab.Panel>

          <Tab.Panel value="frecuencia" scrollable={false}>
            <FrecuenciaSummary frec={evaluation.frec_consumo_alimentos_nutricion} />
          </Tab.Panel>

          <Tab.Panel value="preferencias" scrollable={false}>
            <FieldsSection
              fields={[
                {
                  label: 'Alimentos que le desagradan al paciente',
                  value: evaluation.alimentos_disgusta,
                },
              ]}
              cols={1}
            />
          </Tab.Panel>
        </div>
      </Tab>
    </div>
  )
}
