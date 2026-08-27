import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HiOutlineTrash } from 'react-icons/hi2'

import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Tab from '@components/Tab'
import usePermissions from '@hooks/usePermissions'
import { useUrlState } from '@hooks/useUrlState'
import { usePatient } from '@features/patients/hooks/usePatient'
import { useDeletePatient } from '@features/patients/hooks/useDeletePatient'
import PatientActionBar from '@features/patients/components/PatientActionBar'
import PatientHeader from '@features/patients/components/PatientHeader'
import PatientSkeleton from '@features/patients/components/PatientSkeleton'
import {
  getPatientAreaConfigs,
  collectAreaScopedParams,
} from '@features/patients/patientAreaRegistry'

export default function PatientDetail() {
  const { patient, isPending } = usePatient()
  const { deletePatient, isDeleting } = useDeletePatient()
  const { area: userArea, isAdmin } = usePermissions()
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()

  // Admin ve todas las áreas del paciente; el resto solo la suya.
  const areaConfigs = useMemo(
    () => getPatientAreaConfigs(isAdmin ? patient?.areas : userArea ? [userArea] : []),
    [isAdmin, patient?.areas, userArea]
  )

  const [urlArea] = useUrlState('areaVista', areaConfigs[0]?.area)
  const activeConfig = areaConfigs.find((c) => c.area === urlArea) ?? areaConfigs[0]

  const paramGroups = useMemo(
    () => Object.fromEntries((activeConfig?.tabs ?? []).map((t) => [t.value, t.ownedParams ?? []])),
    [activeConfig]
  )

  function handleAreaChange(area) {
    const scoped = collectAreaScopedParams(areaConfigs)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        scoped.forEach((p) => next.delete(p))
        next.set('areaVista', area)
        return next
      },
      { replace: true }
    )
  }

  if (isPending) return <PatientSkeleton />
  if (!patient || !activeConfig) return null

  const { id } = patient
  const fullName = [patient.nombre, patient.apellidos].filter(Boolean).join(' ')
  const { tabs, editForm } = activeConfig

  return (
    <Modal>
      <div className="space-y-5">
        <PatientActionBar patientName={fullName} isDeleting={isDeleting} />
        <Tab key={activeConfig.area} defaultTab={tabs[0]?.value} syncUrl paramGroups={paramGroups}>
          <PatientHeader
            patient={patient}
            tabs={tabs}
            areas={areaConfigs}
            activeArea={activeConfig.area}
            onAreaChange={handleAreaChange}
          />
          <div className="mt-4 space-y-4">
            {tabs.map((tab) => (
              <Tab.Panel key={tab.value} value={tab.value} scrollable={false}>
                {tab.render(patient)}
              </Tab.Panel>
            ))}
          </div>
        </Tab>
      </div>

      <Modal.Content name="edit-patient" size="xl" noPadding>
        {editForm(patient)}
      </Modal.Content>

      <Modal.Content
        name="delete-patient"
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title="Eliminar paciente"
          description={
            <>
              ¿Estás seguro de borrar a <span className="font-medium">{fullName}</span>?
            </>
          }
          confirmLabel="Eliminar"
          onConfirm={() => deletePatient(id).then(() => navigate('/pacientes'))}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}
