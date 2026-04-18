import { useParams, useSearchParams } from 'react-router'
import { HiOutlinePlus, HiOutlinePencilSquare } from 'react-icons/hi2'
import Heading from '@components/Heading'
import Tab from '@components/Tab'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { useMedicalHistories } from '../hooks/useMedicalHistories'
import { useMedicalHistory } from '../hooks/useMedicalHistory'
import { formatFecha } from '@lib/dateHelpers'
import {
  buildAntPatFields,
  buildAntFamFields,
  buildAparSistFields,
} from '../constants'
import HistoriaPeriodSelect from './HistoriaPeriodSelect'
import FieldsSection from '../sections/FieldsSection'
import SignosVitalesSection from '../sections/SignosVitalesSection'
import NoPatologicosSection from '../sections/NoPatologicosSection'
import ConsultaYPlanSection from '../sections/ConsultaYPlanSection'
import MedicalPatientForm from '../forms/MedicalPatientForm/MedicalPatientForm'

function formatHistoriaOption(h) {
  return { value: h.id, label: formatFecha(h.creado_at) }
}

export default function PatientHistoria({ patient }) {
  const { id: pacienteId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { histories, isPending: isLoadingList } =
    useMedicalHistories(pacienteId)

  const selectedId = searchParams.get('historia')
  const mostRecentId = histories[0]?.id ?? null
  const activeId = selectedId ?? mostRecentId
  const { historia, isPending: isLoadingDetail } = useMedicalHistory(activeId)
  // Para el clone siempre usamos la historia más reciente como base
  const { historia: mostRecentHistoria } = useMedicalHistory(
    mostRecentId !== activeId ? mostRecentId : null
  )
  const cloneBase = mostRecentId !== activeId ? mostRecentHistoria : historia

  function handleSelectHistory(id) {
    setSearchParams({ historia: id }, { replace: true })
  }

  function handleHistoriaCreated(id) {
    setSearchParams({ historia: id }, { replace: true })
  }

  const periodos = histories.map(formatHistoriaOption)
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <Heading as="h3">Historia médica</Heading>
          {!isLoadingList && periodos.length > 0 && (
            <HistoriaPeriodSelect
              value={activeId}
              onChange={handleSelectHistory}
              periodos={periodos}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isLoadingList && patient && (
            <>
              {historia && (
                <Modal.Open opens="edit-history">
                  <Button variant="secondary" size="md" className="gap-1.5">
                    <HiOutlinePencilSquare size={14} />
                    Editar historia
                  </Button>
                </Modal.Open>
              )}
              <Modal.Open opens="new-history">
                <Button variant="primary" size="md" className="gap-1.5">
                  <HiOutlinePlus size={14} />
                  Nueva historia
                </Button>
              </Modal.Open>
            </>
          )}
        </div>
      </div>

      <Modal.Content name="edit-history" size="xl" noPadding>
        {historia && patient && (
          <MedicalPatientForm
            patient={patient}
            historia={historia}
            historiaOnly
          />
        )}
      </Modal.Content>

      <Modal.Content name="new-history" size="xl" noPadding>
        {patient && (
          <MedicalPatientForm
            patient={patient}
            cloneHistoria={cloneBase ?? {}}
            onCreated={handleHistoriaCreated}
          />
        )}
      </Modal.Content>

      <Tab variant="underline" defaultTab="heredofamiliares">
        <Tab.List>
          <Tab.Trigger value="heredofamiliares">Heredofamiliares</Tab.Trigger>
          <Tab.Trigger value="no-patologicos">No Patológicos</Tab.Trigger>
          <Tab.Trigger value="patologicos">Patológicos</Tab.Trigger>
          <Tab.Trigger value="aparatos">Aparatos y sistemas</Tab.Trigger>
          <Tab.Trigger value="exploracion">Exploración física</Tab.Trigger>
          <Tab.Trigger value="consulta-plan">Consulta y Plan</Tab.Trigger>
        </Tab.List>

        <div className="p-5">
          {isLoadingList || isLoadingDetail ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-5 animate-pulse rounded bg-zinc-100"
                />
              ))}
            </div>
          ) : !historia ? (
            <p className="text-5 py-8 text-center text-zinc-400">
              Sin historia médica registrada.
            </p>
          ) : (
            <>
              <Tab.Panel value="heredofamiliares" scrollable={false}>
                <FieldsSection
                  fields={buildAntFamFields(historia.antecedentes_familiares)}
                />
              </Tab.Panel>
              <Tab.Panel value="no-patologicos" scrollable={false}>
                <NoPatologicosSection historia={historia} />
              </Tab.Panel>
              <Tab.Panel value="patologicos" scrollable={false}>
                <FieldsSection
                  fields={buildAntPatFields(historia.antecedentes_patologicos)}
                  cols={3}
                />
              </Tab.Panel>
              <Tab.Panel value="aparatos" scrollable={false}>
                <FieldsSection
                  fields={buildAparSistFields(historia.aparatos_sistemas)}
                  cols={3}
                />
              </Tab.Panel>
              <Tab.Panel value="exploracion" scrollable={false}>
                <SignosVitalesSection info={historia.informacion_fisica} />
              </Tab.Panel>
              <Tab.Panel value="consulta-plan" scrollable={false}>
                <ConsultaYPlanSection historia={historia} />
              </Tab.Panel>
            </>
          )}
        </div>
      </Tab>
    </div>
  )
}
