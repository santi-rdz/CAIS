import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import Heading from '@components/Heading'
import { useTabStep } from '@hooks/useTabStep'
import { formatFecha } from '@lib/dateHelpers'
import { formatNumber } from '@lib/utils'
import ObtenidoVsTeoricoPanel from '@features/patients/nutricion/forms/CalGetNutrForm/ObtenidoVsTeoricoPanel'
import DistribucionResumen from '@features/patients/nutricion/forms/CalGetNutrForm/DistribucionResumen'

const fmt = (v, unit) => (v == null || v === '' ? '—' : `${formatNumber(v)} ${unit}`)

// Tab del detalle → step de CalGetNutrForm (mismo orden que STEPS ahí).
const TAB_TO_STEP = { get: 0, equivalentes: 1 }

function DatoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white px-4 py-3">
      <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">{label}</p>
      <p className="text-4 font-semibold text-zinc-800">{value}</p>
    </div>
  )
}

export default function CalGetNutrDetail({ registro, onBack, onEdit, onDelete }) {
  const { activeTab, setActiveTab, initialStep } = useTabStep(TAB_TO_STEP, undefined, 'calGetTab')

  const obtenido = {
    kcal: registro.total_kcal,
    proteinas: registro.total_proteinas,
    grasas: registro.total_grasas,
    carbohidratos: registro.total_carbohidratos,
  }
  const objetivos = registro.objetivos

  return (
    <div data-testid="cal-get-nutr-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">GET nutricional</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">
            {formatFecha(registro.fecha_eval)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label="Eliminar cálculo de GET nutricional"
            onClick={() => onDelete?.(registro)}
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
            Editar cálculo
          </Button>
        </div>
      </div>

      <Tab variant="underline" value={activeTab} onValueChange={setActiveTab}>
        <Tab.List>
          <Tab.Trigger value="get">Estimación y balance</Tab.Trigger>
          <Tab.Trigger value="equivalentes">Distribución</Tab.Trigger>
        </Tab.List>

        <div className="space-y-5 pt-5">
          <Tab.Panel value="get" scrollable={false}>
            <div className="space-y-6">
              <section className="space-y-3">
                <Heading as="h4" showBar>
                  Datos y objetivos
                </Heading>
                <div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
                  <DatoTile label="Peso" value={fmt(registro.peso, 'kg')} />
                  <DatoTile label="Estatura" value={fmt(registro.estatura, 'cm')} />
                  <DatoTile label="Energía / kg" value={fmt(registro.kcal_kg, 'kcal')} />
                  <DatoTile
                    label="GET total"
                    value={objetivos?.get ? `${formatNumber(objetivos.get)} kcal` : '—'}
                  />
                </div>
              </section>

              <section className="space-y-3">
                <Heading as="h4" showBar>
                  Balance: obtenido vs teórico
                </Heading>
                <ObtenidoVsTeoricoPanel obtenido={obtenido} objetivos={objetivos} />
              </section>
            </div>
          </Tab.Panel>

          <Tab.Panel value="equivalentes" scrollable={false}>
            <DistribucionResumen registro={registro} />
          </Tab.Panel>
        </div>
      </Tab>
    </div>
  )
}
