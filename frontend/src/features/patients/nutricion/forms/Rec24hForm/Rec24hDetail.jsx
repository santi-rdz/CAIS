import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2'
import Tab from '@components/Tab'
import Button from '@components/Button'
import { useTabStep } from '@hooks/useTabStep'
import { formatFecha } from '@lib/dateHelpers'
import ObjetivoVsRealPanel from '@features/patients/nutricion/forms/Rec24hForm/ObjetivoVsRealPanel'
import GruposResumen from '@features/patients/nutricion/forms/Rec24hForm/GruposResumen'
import Heading from '@components/Heading'
import { pickObjectivesFromRow } from '@features/patients/nutricion/forms/Rec24hForm/serialize'

// Tab del detalle → step de Rec24hForm (mismo orden que STEPS ahí).
const TAB_TO_STEP = { resumen: 0, alimentos: 1 }

export default function Rec24hDetail({ rec, onBack, onEdit, onDelete }) {
  const { activeTab, setActiveTab, initialStep } = useTabStep(TAB_TO_STEP, undefined, 'recTab')
  const comidas = rec.rec_24h_comidas ?? []
  const objetivos = pickObjectivesFromRow(rec)

  return (
    <div data-testid="rec-24h-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">Recordatorio 24h</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">{formatFecha(rec.fecha_eval)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label="Eliminar recordatorio de 24 horas"
            onClick={() => onDelete?.(rec)}
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
            Editar recordatorio
          </Button>
        </div>
      </div>

      <Tab variant="underline" value={activeTab} onValueChange={setActiveTab}>
        <Tab.List>
          <Tab.Trigger value="resumen">Objetivo vs ingesta</Tab.Trigger>
          <Tab.Trigger value="alimentos">Alimentos ({comidas.length})</Tab.Trigger>
        </Tab.List>

        <div className="space-y-5 pt-5">
          <Tab.Panel value="resumen" scrollable={false}>
            <div className="space-y-6">
              <ObjetivoVsRealPanel objetivos={objetivos} comidas={comidas} />
              <section className="space-y-3">
                <Heading as="h4" showBar>
                  Resumen por grupos de alimentos
                </Heading>
                <GruposResumen comidas={comidas} />
              </section>
            </div>
          </Tab.Panel>

          <Tab.Panel value="alimentos" scrollable={false}>
            {comidas.length === 0 ? (
              <p className="text-5 rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-zinc-400">
                Sin alimentos registrados.
              </p>
            ) : (
              <ul className="space-y-2">
                {comidas.map((c, idx) => (
                  <li
                    key={c.id ?? idx}
                    onClick={() => onEdit?.(1, { foodIndex: idx })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onEdit?.(1, { foodIndex: idx })
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Editar ${c.alimento}`}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-100 px-3 py-2.5 transition-colors hover:border-teal-300 hover:bg-teal-50/40"
                  >
                    <span className="text-6 flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-600 font-semibold text-white">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-5 truncate font-medium text-zinc-800">{c.alimento}</p>
                      <p className="text-6 truncate text-zinc-400">
                        {[c.comida, c.grupo].filter(Boolean).join(' • ') || 'Sin detalle'}
                      </p>
                    </div>
                    {c.calorias != null && (
                      <span className="text-6 shrink-0 font-medium text-zinc-500">
                        {c.calorias} kcal
                      </span>
                    )}
                    <HiOutlinePencil
                      size={15}
                      className="shrink-0 text-zinc-300 transition-colors group-hover:text-teal-600"
                    />
                  </li>
                ))}
              </ul>
            )}
          </Tab.Panel>
        </div>
      </Tab>
    </div>
  )
}
