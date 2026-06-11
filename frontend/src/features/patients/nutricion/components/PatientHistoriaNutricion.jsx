import { useParams, useSearchParams } from 'react-router-dom'
import Tab from '@components/Tab'
import DataField from '@components/DataField'
import { formatFecha } from '@lib/dateHelpers'
import HistoriaPeriodSelect from '@features/patients/medicina/components/HistoriaPeriodSelect'
import { useNutritionHistories } from '@features/patients/nutricion/hooks/useNutritionHistories'
import { useNutritionHistory } from '@features/patients/nutricion/hooks/useNutritionHistory'
import RecordTable from '@features/patients/nutricion/sections/RecordTable'
import {
  ENFERMEDAD_COLUMNS,
  TRATAMIENTO_COLUMNS,
  ADICCIONES_COLUMNS,
  buildAdiccionesRows,
} from '@features/patients/nutricion/constants'

function formatHistoriaOption(h) {
  return { value: h.id, label: formatFecha(h.fecha_ingreso) }
}

export default function PatientHistoriaNutricion() {
  const { id: pacienteId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { histories, isPending: isLoadingList } = useNutritionHistories(pacienteId)

  const selectedId = searchParams.get('historia')
  const mostRecentId = histories[0]?.id ?? null
  const activeId = selectedId ?? mostRecentId
  const { historia, isPending: isLoadingDetail } = useNutritionHistory(activeId)

  function handleSelectHistory(id) {
    setSearchParams({ historia: id }, { replace: true })
  }

  const periodos = histories.map(formatHistoriaOption)
  const isLoading = isLoadingList || (activeId != null && isLoadingDetail)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {!isLoadingList && periodos.length > 0 && (
          <>
            <span className="text-6 text-zinc-400">Historia nutricional</span>
            <HistoriaPeriodSelect
              value={activeId}
              onChange={handleSelectHistory}
              periodos={periodos}
            />
          </>
        )}
      </div>

      <div className="shadow-card rounded-2xl border border-gray-100 bg-white">
        <Tab variant="underline" defaultTab="enfermedades">
          <Tab.List>
            <Tab.Trigger value="enfermedades">Historia médica</Tab.Trigger>
            <Tab.Trigger value="adicciones">Adicciones</Tab.Trigger>
            <Tab.Trigger value="tratamientos">Tratamientos alternativos</Tab.Trigger>
          </Tab.List>

          <div className="p-5">
            {isLoading ? (
              <div className="space-y-3 py-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-5 animate-pulse rounded bg-zinc-100" />
                ))}
              </div>
            ) : !historia ? (
              <p className="text-5 py-8 text-center text-zinc-400">
                Sin historia nutricional registrada.
              </p>
            ) : (
              <>
                <Tab.Panel value="enfermedades" scrollable={false}>
                  <div className="space-y-6">
                    <DataField
                      label="Motivo de consulta"
                      value={historia.motivo_consulta}
                      multiline
                      block
                    />
                    <RecordTable
                      columns={ENFERMEDAD_COLUMNS}
                      rows={historia.historias_medicas_nutricion}
                      emptyMessage="Sin enfermedades registradas."
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel value="adicciones" scrollable={false}>
                  <RecordTable
                    columns={ADICCIONES_COLUMNS}
                    rows={buildAdiccionesRows(historia.adicciones)}
                    emptyMessage="Sin adicciones registradas."
                  />
                </Tab.Panel>
                <Tab.Panel value="tratamientos" scrollable={false}>
                  <RecordTable
                    columns={TRATAMIENTO_COLUMNS}
                    rows={historia.tratamiento_alt_nutricion}
                    emptyMessage="Sin tratamientos alternativos registrados."
                  />
                </Tab.Panel>
              </>
            )}
          </div>
        </Tab>
      </div>
    </div>
  )
}
