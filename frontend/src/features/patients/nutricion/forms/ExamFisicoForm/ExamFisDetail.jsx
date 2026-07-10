import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import { useTabStep } from '@hooks/useTabStep'
import { formatFecha } from '@lib/dateHelpers'
import PesoSummary from '@features/patients/nutricion/forms/ExamFisicoForm/PesoSummary'
import SintomasSignosSummary from '@features/patients/nutricion/forms/ExamFisicoForm/SintomasSignosSummary'
import SemiologiaSummary from '@features/patients/nutricion/forms/ExamFisicoForm/SemiologiaSummary'

// Tab del detalle → step de ExamFisicoForm (mismo orden que STEPS ahí).
const TAB_TO_STEP = { peso: 0, sintomas: 1, semiologia: 2, genitourinario: 3 }

export default function ExamFisDetail({ exam, onBack, onEdit, onDelete }) {
  const { activeTab, setActiveTab, initialStep } = useTabStep(TAB_TO_STEP, undefined, 'examTab')

  return (
    <div data-testid="exam-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">Examen físico</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">
            {formatFecha(exam.fecha ?? exam.creado_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label="Eliminar examen físico"
            onClick={() => onDelete?.(exam)}
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
            Editar examen
          </Button>
        </div>
      </div>

      <Tab variant="underline" value={activeTab} onValueChange={setActiveTab}>
        <Tab.List>
          <Tab.Trigger value="peso">Monitoreo de Peso</Tab.Trigger>
          <Tab.Trigger value="sintomas">Síntomas GI y Signos</Tab.Trigger>
          <Tab.Trigger value="semiologia">Evaluación Semiológica</Tab.Trigger>
          <Tab.Trigger value="genitourinario">Sistema Genitourinario</Tab.Trigger>
        </Tab.List>

        <div className="space-y-5 pt-5">
          <Tab.Panel value="peso" scrollable={false}>
            <PesoSummary peso={exam.eval_perdida_peso_nutricion} />
          </Tab.Panel>

          <Tab.Panel value="sintomas" scrollable={false}>
            <SintomasSignosSummary
              sintomas={exam.eval_sintomas_gastroin_nutricion}
              signos={exam.signos_vitales_nutricion}
            />
          </Tab.Panel>

          <Tab.Panel value="semiologia" scrollable={false}>
            <SemiologiaSummary semiologia={exam.eval_semiologia_nutricional} />
          </Tab.Panel>

          <Tab.Panel value="genitourinario" scrollable={false}>
            <FieldsSection
              fields={[
                {
                  label: 'Observaciones del sistema genitourinario',
                  value: exam.eval_semiologia_nutricional?.descripcion_sist_genito_urinario,
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
