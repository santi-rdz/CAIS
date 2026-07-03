import { useRef, useState } from 'react'
import { HiOutlinePlus, HiOutlineBeaker, HiOutlineTrash } from 'react-icons/hi2'
import { useUrlState } from '@hooks/useUrlState'
import { usePatientHistoria } from '@features/patients/hooks/usePatientHistoria'
import PatientHistoriaShell from '@features/patients/components/PatientHistoriaShell'
import { useNutritionHistories } from '@features/patients/nutricion/hooks/useNutritionHistories'
import { useNutritionHistory } from '@features/patients/nutricion/hooks/useNutritionHistory'
import NutritionalPatientForm from '@features/patients/nutricion/forms/NutritionalPatientForm/NutritionalPatientForm'
import EvalSuenoForm from '@features/patients/nutricion/forms/EvalSuenoForm'
import EvalActFisicaForm from '@features/patients/nutricion/forms/EvalActFisicaForm'
import EvalBioquimicaForm from '@features/patients/nutricion/forms/EvalBioquimicaForm/EvalBioquimicaForm'
import BioqDetail from '@features/patients/nutricion/forms/EvalBioquimicaForm/BioqDetail'
import BioqCard from '@features/patients/nutricion/components/BioqCard'
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

// Tab de la vista → step de la modal principal (HISTORIA_STEPS).
// HISTORIA_STEPS = STEPS.slice(1): 0=Historia Médica, 1=Tratamiento, 2=Adicciones, 3=Sueño, 4=AF
const TAB_TO_STEP = { enfermedades: 0, tratamientos: 1, adicciones: 2, sueno: 3, af: 4 }

// ─── Tab calidad del sueño ────────────────────────────────────────────────────
// Tiene su propio <Modal> para no interferir con el context de PatientDetail.
// El botón oculto actúa como puente entre el estado local y el sistema de
// nombres del Modal.

function SuenoTab({ historia }) {
  const [editingEval, setEditingEval] = useState(null)
  const openRef = useRef(null)

  function handleAdd() {
    setEditingEval(null)
    openRef.current?.click()
  }

  function handleEdit(row) {
    setEditingEval(row)
    openRef.current?.click()
  }

  return (
    <Modal>
      {/* Trigger oculto — se activa programáticamente */}
      <Modal.Open opens="sueno-form">
        <button ref={openRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Heading as="h4">Calidad del Sueño</Heading>
          <Button type="button" size="sm" variant="primary" onClick={handleAdd}>
            <HiOutlinePlus size={13} strokeWidth={2.5} />
            Agregar
          </Button>
        </div>
        <RecordTable
          columns={SUENO_COLUMNS}
          rows={historia.eval_cal_sueno}
          emptyMessage="Sin evaluaciones de sueño registradas."
          onEdit={handleEdit}
        />
      </div>

      <Modal.Content name="sueno-form" size="md" noPadding>
        <EvalSuenoForm
          key={editingEval?.id ?? 'new-sueno'}
          historiaId={historia.id}
          eval={editingEval ?? undefined}
          title={editingEval?.id ? 'Editar evaluación de sueño' : 'Nueva evaluación de sueño'}
        />
      </Modal.Content>
    </Modal>
  )
}

// ─── Tab actividad física ─────────────────────────────────────────────────────

function ActFisicaTab({ historia }) {
  const [editingEval, setEditingEval] = useState(null)
  const openRef = useRef(null)

  function handleAdd() {
    setEditingEval(null)
    openRef.current?.click()
  }

  function handleEdit(row) {
    setEditingEval(row)
    openRef.current?.click()
  }

  return (
    <Modal>
      <Modal.Open opens="af-form">
        <button ref={openRef} type="button" hidden aria-hidden="true" />
      </Modal.Open>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Heading as="h4">Actividad Física</Heading>
          <Button type="button" size="sm" variant="primary" onClick={handleAdd}>
            <HiOutlinePlus size={13} strokeWidth={2.5} />
            Agregar
          </Button>
        </div>
        <RecordTable
          columns={ACT_FISICA_COLUMNS}
          rows={historia.eval_act_fisica_nutricion}
          emptyMessage="Sin evaluaciones de actividad física registradas."
          onEdit={handleEdit}
        />
      </div>

      <Modal.Content name="af-form" size="lg" noPadding>
        <EvalActFisicaForm
          key={editingEval?.id ?? 'new-af'}
          historiaId={historia.id}
          eval={editingEval ?? undefined}
          title={
            editingEval?.id
              ? 'Editar evaluación de actividad física'
              : 'Nueva evaluación de actividad física'
          }
        />
      </Modal.Content>
    </Modal>
  )
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
  const { evaluations, isPending } = useBiochemicalEvals(historia.id)
  const { evaluation: selectedEval, isPending: isSelectedPending } = useBiochemicalEval(selectedId)
  const { evaluation: editingEval, isPending: isEditingPending } = useBiochemicalEval(editingId)
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
        isSelectedPending || !selectedEval ? (
          <div className="h-[400px] animate-pulse rounded-xl bg-zinc-100" />
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
        <RecordTable
          columns={ENFERMEDAD_COLUMNS}
          rows={historia.historias_medicas_nutricion}
          emptyMessage="Sin enfermedades registradas."
        />
      </div>
    ),
  },
  {
    value: 'tratamientos',
    label: 'Tratamientos alternativos',
    render: (historia) => (
      <RecordTable
        columns={TRATAMIENTO_COLUMNS}
        rows={historia.tratamiento_alt_nutricion}
        emptyMessage="Sin tratamientos alternativos registrados."
      />
    ),
  },
  {
    value: 'adicciones',
    label: 'Adicciones',
    render: (historia) => (
      <RecordTable columns={ADICCIONES_COLUMNS} rows={buildAdiccionesRows(historia.adicciones)} />
    ),
  },
  {
    value: 'sueno',
    label: 'Sueño',
    render: (historia) => <SuenoTab historia={historia} />,
  },
  {
    value: 'af',
    label: 'Actividad física',
    render: (historia) => <ActFisicaTab historia={historia} />,
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
