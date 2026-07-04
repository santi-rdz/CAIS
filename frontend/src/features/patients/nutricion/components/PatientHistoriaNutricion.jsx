import { useRef, useState } from 'react'
import {
  HiOutlinePlus,
  HiOutlineBeaker,
  HiOutlineTrash,
  HiOutlineMoon,
  HiOutlineHeart,
  HiOutlineClipboardDocumentList,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import { useUrlState } from '@hooks/useUrlState'
import { usePatientHistoria } from '@features/patients/hooks/usePatientHistoria'
import PatientHistoriaShell from '@features/patients/components/PatientHistoriaShell'
import { useNutritionHistories } from '@features/patients/nutricion/hooks/useNutritionHistories'
import { useNutritionHistory } from '@features/patients/nutricion/hooks/useNutritionHistory'
import { useEvalMonitoreo } from '@features/patients/nutricion/hooks/useEvalMonitoreo'
import NutritionalPatientForm from '@features/patients/nutricion/forms/NutritionalPatientForm/NutritionalPatientForm'
import EvalSuenoForm from '@features/patients/nutricion/forms/EvalSuenoForm'
import EvalActFisicaForm from '@features/patients/nutricion/forms/EvalActFisicaForm'
import EvalBioquimicaForm from '@features/patients/nutricion/forms/EvalBioquimicaForm/EvalBioquimicaForm'
import BioqDetail from '@features/patients/nutricion/forms/EvalBioquimicaForm/BioqDetail'
import BioqCard from '@features/patients/nutricion/components/BioqCard'
import MonitoreoCard from '@features/patients/nutricion/components/MonitoreoCard'
import MonitoreoDetail from '@features/patients/nutricion/components/MonitoreoDetail'
import { useBiochemicalEvals } from '@features/patients/nutricion/hooks/useBiochemicalEvals'
import { useBiochemicalEval } from '@features/patients/nutricion/hooks/useBiochemicalEval'
import { useDeleteBiochemicalEval } from '@features/patients/nutricion/hooks/useDeleteBiochemicalEval'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import RecordTable from '@features/patients/shared/sections/RecordTable'
import EmptyState from '@components/EmptyState'
import Modal from '@components/Modal'
import Button from '@components/Button'
import DangerConfirm from '@components/DangerConfirm'
import Heading from '@components/Heading'
import {
  ENFERMEDAD_COLUMNS,
  TRATAMIENTO_COLUMNS,
  ADICCIONES_COLUMNS,
  SUENO_COLUMNS,
  ACT_FISICA_COLUMNS,
  buildAdiccionesRows,
} from '@features/patients/nutricion/constants'

// Subconjunto de columnas a mostrar en el cuerpo resumido de la card.
const pickCols = (columns, keys) => columns.filter((c) => keys.includes(c.key))

// Tab de la vista → step de la modal principal (HISTORIA_STEPS).
// HISTORIA_STEPS = STEPS.slice(1): 0=Historia Médica, 1=Tratamiento, 2=Adicciones, 3=Sueño, 4=AF
const TAB_TO_STEP = { enfermedades: 0, tratamientos: 1, adicciones: 2, sueno: 3, af: 4 }

// ─── Tab genérico de monitoreo (sueño / actividad física) ──────────────────────
// Mismo flujo que BioquimicaTab (grid de cards → detalle → editar/eliminar), pero
// leyendo la data ya embebida en la historia. `config` lo parametriza por recurso.
// La data (id UUID) permite seleccionar el registro por URL (?suenoEval / ?afEval).

function MonitoreoTab({ historia, config }) {
  const Icon = config.icon
  const FormComponent = config.FormComponent
  const rows = historia[config.rowsKey] ?? []
  const [selectedId, setSelectedId] = useUrlState(config.urlParam, null)
  const [editingRow, setEditingRow] = useState(null)
  const [deletingRow, setDeletingRow] = useState(null)
  const openRef = useRef(null)
  const deleteOpenRef = useRef(null)
  const monitoreo = useEvalMonitoreo(historia.id)
  const deleteEval = monitoreo[config.deleteFn]
  const isDeleting = monitoreo[config.isDeletingFlag]

  const selectedRow = selectedId ? (rows.find((r) => r.id === selectedId) ?? null) : null

  function handleAdd() {
    setEditingRow(null)
    openRef.current?.click()
  }

  function handleEdit(row) {
    setEditingRow(row)
    openRef.current?.click()
  }

  function handleDeleteRequest(row) {
    setDeletingRow(row)
    deleteOpenRef.current?.click()
  }

  async function handleConfirmDelete() {
    const wasSelected = selectedId === deletingRow.id
    if (wasSelected) setSelectedId(null)
    try {
      await deleteEval(deletingRow.id)
    } catch {
      if (wasSelected) setSelectedId(deletingRow.id)
    }
  }

  return (
    <Modal>
      <Modal.Open opens={config.formName}>
        <button ref={openRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>
      <Modal.Open opens={config.deleteName}>
        <button ref={deleteOpenRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>

      {selectedId && selectedRow ? (
        <MonitoreoDetail
          row={selectedRow}
          title={config.title}
          backLabel={config.backLabel}
          columns={config.columns}
          onBack={() => setSelectedId(null)}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      ) : selectedId ? (
        <EmptyState
          icon={<Icon size={24} />}
          message="No se encontró la evaluación"
          hint="Puede que haya sido eliminada."
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Heading as="h4">{config.title}</Heading>
            <Button type="button" size="sm" variant="primary" onClick={handleAdd}>
              <HiOutlinePlus size={13} strokeWidth={2.5} />
              Agregar
            </Button>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              icon={<Icon size={24} />}
              message={config.emptyMessage}
              hint="Registra la primera evaluación de esta historia."
            />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {rows.map((row) => (
                <MonitoreoCard
                  key={row.id}
                  row={row}
                  icon={Icon}
                  summary={config.summary}
                  onView={(r) => setSelectedId(r.id)}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal.Content name={config.formName} size={config.modalSize} noPadding>
        <FormComponent
          key={editingRow?.id ?? `new-${config.urlParam}`}
          historiaId={historia.id}
          eval={editingRow ?? undefined}
          title={editingRow?.id ? config.formTitleEdit : config.formTitleNew}
        />
      </Modal.Content>

      <Modal.Content
        name={config.deleteName}
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title={config.deleteTitle}
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={handleConfirmDelete}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}

const SUENO_CONFIG = {
  rowsKey: 'eval_cal_sueno',
  urlParam: 'suenoEval',
  icon: HiOutlineMoon,
  title: 'Calidad del Sueño',
  backLabel: 'Sueño',
  columns: SUENO_COLUMNS,
  summary: pickCols(SUENO_COLUMNS, ['horas_sueno', 'clasif_horas_sueno']),
  FormComponent: EvalSuenoForm,
  formName: 'sueno-form',
  deleteName: 'delete-sueno',
  modalSize: 'md',
  formTitleNew: 'Nueva evaluación de sueño',
  formTitleEdit: 'Editar evaluación de sueño',
  deleteTitle: 'Eliminar evaluación de sueño',
  emptyMessage: 'Sin evaluaciones de sueño registradas',
  deleteFn: 'deleteSueno',
  isDeletingFlag: 'isDeletingSueno',
}

const ACT_FISICA_CONFIG = {
  rowsKey: 'eval_act_fisica_nutricion',
  urlParam: 'afEval',
  icon: HiOutlineHeart,
  title: 'Actividad Física',
  backLabel: 'Actividad física',
  columns: ACT_FISICA_COLUMNS,
  summary: pickCols(ACT_FISICA_COLUMNS, ['tipo', 'frecuencia', 'duracion']),
  FormComponent: EvalActFisicaForm,
  formName: 'af-form',
  deleteName: 'delete-af',
  modalSize: 'lg',
  formTitleNew: 'Nueva evaluación de actividad física',
  formTitleEdit: 'Editar evaluación de actividad física',
  deleteTitle: 'Eliminar evaluación de actividad física',
  emptyMessage: 'Sin evaluaciones de actividad física registradas',
  deleteFn: 'deleteActFisica',
  isDeletingFlag: 'isDeletingActFisica',
}

// ─── Tab evaluación bioquímica ────────────────────────────────────────────────
// A diferencia de sueño/AF, la lista y el detalle de edición se cargan aparte
// (endpoint propio) en vez de venir embebidos en la historia — así el fetch
// solo ocurre cuando el usuario entra a este tab.

function BioquimicaTab({ historia }) {
  const [selectedId, setSelectedId] = useUrlState('bioqEval', null)
  const [editingId, setEditingId] = useState(null)
  const [editingStep, setEditingStep] = useState(0)
  const [deletingEval, setDeletingEval] = useState(null)
  const openRef = useRef(null)
  const deleteOpenRef = useRef(null)
  const { evaluations, isPending, isError } = useBiochemicalEvals(historia.id)
  const {
    evaluation: selectedEval,
    isPending: isSelectedPending,
    isError: isSelectedError,
  } = useBiochemicalEval(selectedId)
  const {
    evaluation: editingEval,
    isPending: isEditingPending,
    isError: isEditingError,
  } = useBiochemicalEval(editingId)
  const { deleteEval, isDeleting } = useDeleteBiochemicalEval(historia.id)

  function handleAdd() {
    setEditingId(null)
    setEditingStep(0)
    openRef.current?.click()
  }

  function handleEdit(row, step = 0) {
    setEditingId(row.id)
    setEditingStep(step)
    openRef.current?.click()
  }

  function handleDeleteRequest(row) {
    setDeletingEval(row)
    deleteOpenRef.current?.click()
  }

  async function handleConfirmDelete() {
    const wasSelected = selectedId === deletingEval.id
    // Sale del detalle ANTES del await: si se queda, la invalidación de
    // useDeleteBiochemicalEval refetchea el detalle recién borrado (404).
    if (wasSelected) setSelectedId(null)
    try {
      await deleteEval(deletingEval.id)
    } catch {
      if (wasSelected) setSelectedId(deletingEval.id)
    }
  }

  return (
    <Modal>
      <Modal.Open opens="bioq-form">
        <button ref={openRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>
      <Modal.Open opens="delete-bioq-eval">
        <button ref={deleteOpenRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>

      {selectedId ? (
        isSelectedPending ? (
          <div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
        ) : isSelectedError || !selectedEval ? (
          <EmptyState
            icon={<HiOutlineBeaker size={24} />}
            message="No se pudo cargar la evaluación"
            hint="Intenta de nuevo más tarde."
          />
        ) : (
          <BioqDetail
            evaluation={selectedEval}
            onBack={() => setSelectedId(null)}
            onEdit={(step) => handleEdit(selectedEval, step)}
            onDelete={handleDeleteRequest}
          />
        )
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Heading as="h4">Evaluación Bioquímica</Heading>
            <Button type="button" size="sm" variant="primary" onClick={handleAdd}>
              <HiOutlinePlus size={13} strokeWidth={2.5} />
              Agregar
            </Button>
          </div>

          {isPending ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-[92px] animate-pulse rounded-xl bg-zinc-100" />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon={<HiOutlineBeaker size={24} />}
              message="No se pudieron cargar las evaluaciones bioquímicas"
              hint="Intenta de nuevo más tarde."
            />
          ) : evaluations.length === 0 ? (
            <EmptyState
              icon={<HiOutlineBeaker size={24} />}
              message="Sin evaluaciones bioquímicas"
              hint="Registra la primera evaluación de esta historia."
            />
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
              {evaluations.map((evaluation) => (
                <BioqCard
                  key={evaluation.id}
                  evaluation={evaluation}
                  onView={(row) => setSelectedId(row.id)}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal.Content name="bioq-form" size="xl" noPadding>
        {editingId && isEditingPending ? (
          <div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
        ) : editingId && isEditingError ? (
          <EmptyState
            icon={<HiOutlineBeaker size={24} />}
            message="No se pudo cargar la evaluación a editar"
            hint="Cierra el modal e intenta de nuevo."
          />
        ) : (
          <EvalBioquimicaForm
            key={editingEval?.id ?? 'new-bioq'}
            historiaId={historia.id}
            evaluation={editingId ? editingEval : null}
            initialStep={editingStep}
          />
        )}
      </Modal.Content>

      <Modal.Content
        name="delete-bioq-eval"
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title="Eliminar evaluación bioquímica"
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={handleConfirmDelete}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  {
    value: 'enfermedades',
    label: 'Historia médica',
    render: (historia) => (
      <div className="space-y-6">
        <FieldsSection
          fields={[{ label: 'Motivo de consulta', value: historia.motivo_consulta }]}
          cols={1}
        />
        <div className="space-y-3">
          <Heading as="h4">Enfermedades</Heading>
          <RecordTable
            columns={ENFERMEDAD_COLUMNS}
            rows={historia.historias_medicas_nutricion}
            emptyMessage="Sin enfermedades registradas."
            emptyIcon={<HiOutlineClipboardDocumentList size={24} />}
          />
        </div>
      </div>
    ),
  },
  {
    value: 'tratamientos',
    label: 'Tratamientos alternativos',
    render: (historia) => (
      <div className="space-y-3">
        <Heading as="h4">Tratamientos alternativos</Heading>
        <RecordTable
          columns={TRATAMIENTO_COLUMNS}
          rows={historia.tratamiento_alt_nutricion}
          emptyMessage="Sin tratamientos alternativos registrados."
          emptyIcon={<HiOutlineSparkles size={24} />}
        />
      </div>
    ),
  },
  {
    value: 'adicciones',
    label: 'Adicciones',
    render: (historia) => (
      <div className="space-y-3">
        <Heading as="h4">Adicciones</Heading>
        <RecordTable columns={ADICCIONES_COLUMNS} rows={buildAdiccionesRows(historia.adicciones)} />
      </div>
    ),
  },
  {
    value: 'sueno',
    label: 'Sueño',
    render: (historia) => <MonitoreoTab historia={historia} config={SUENO_CONFIG} />,
  },
  {
    value: 'af',
    label: 'Actividad física',
    render: (historia) => <MonitoreoTab historia={historia} config={ACT_FISICA_CONFIG} />,
  },
  {
    value: 'bioquimica',
    label: 'Bioquímica',
    render: (historia) => <BioquimicaTab historia={historia} />,
  },
]

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PatientHistoriaNutricion({ patient }) {
  const state = usePatientHistoria({
    useHistories: useNutritionHistories,
    useHistory: useNutritionHistory,
    periodField: 'fecha_ingreso',
    tabToStep: TAB_TO_STEP,
    dependentParams: ['bioqEval', 'bioqTab', 'suenoEval', 'afEval'],
  })

  return (
    <PatientHistoriaShell
      patient={patient}
      periodLabel="Historia nutricional"
      FormComponent={NutritionalPatientForm}
      tabs={TABS}
      emptyMessage="Sin historia nutricional registrada."
      errorMessage="No se pudo cargar la historia nutricional. Intenta de nuevo."
      {...state}
    />
  )
}
