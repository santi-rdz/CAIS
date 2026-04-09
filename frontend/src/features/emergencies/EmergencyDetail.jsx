import Heading from '@components/Heading'
import Tag from '@components/Tag'
import Button from '@components/Button'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import { formatFechaLong, formatHora } from '@lib/dateHelpers'
import {
  HiChevronRight,
  HiOutlineClock,
  HiOutlineIdentification,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineUser,
} from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router'
import { useEmergency } from './hooks/useEmergency'
import { useDeleteEmergency } from './hooks/useDeleteEmergency'
import EmergencyForm from './EmergencyForm'

export default function EmergencyDetail() {
  const { emergency, isPending } = useEmergency()
  const { deleteEmergency, isDeleting } = useDeleteEmergency()
  const navigate = useNavigate()

  if (isPending) return <Skeleton />
  if (!emergency) return null

  return (
    <Modal>
      <div className="space-y-6">
        <ActionBar
          emergencyDate={formatFechaLong(emergency.fecha_hora)}
          isDeleting={isDeleting}
        />
        <HeaderCard emergency={emergency} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PatientCard emergency={emergency} />
          <MedicalCard emergency={emergency} />
        </div>
      </div>

      <Modal.Content name="edit-emergency" noPadding>
        <EmergencyForm emergency={emergency} />
      </Modal.Content>

      <Modal.Content
        name="delete-emergency"
        noPadding
        variant="alert"
        icon={<HiOutlineTrash size={26} />}
      >
        <DangerConfirm
          title="Eliminar emergencia"
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={() =>
            deleteEmergency(emergency.id).then(() => navigate('/emergencias'))
          }
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}

function ActionBar({ emergencyDate, isDeleting }) {
  return (
    <div className="flex items-center justify-between">
      <nav className="text-5 flex items-center gap-1.5 text-zinc-400">
        <Link
          to="/emergencias"
          className="transition-colors hover:text-zinc-700"
        >
          Bitácora
        </Link>
        <HiChevronRight size={14} />
        <span className="font-medium text-zinc-700">{emergencyDate}</span>
      </nav>
      <div className="flex gap-2">
        <Modal.Open opens="edit-emergency">
          <Button variant="secondary" size="md" className="gap-1.5">
            <HiOutlinePencilSquare size={14} />
            Editar
          </Button>
        </Modal.Open>
        <Modal.Open opens="delete-emergency">
          <Button
            variant="danger-o"
            size="md"
            className="gap-1.5 text-red-600"
            isLoading={isDeleting}
          >
            <HiOutlineTrash size={14} />
            Eliminar
          </Button>
        </Modal.Open>
      </div>
    </div>
  )
}

function HeaderCard({ emergency }) {
  const { fecha_hora, ubicacion, recurrente, registrado_por } = emergency
  const fecha = formatFechaLong(fecha_hora)
  const hora = formatHora(fecha_hora)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-5 mb-1 text-neutral-400">Emergencia registrada</p>
          <Heading as="h3">{fecha}</Heading>
        </div>
        {recurrente && (
          <Tag type="pendiente" size="sm">
            Recurrente
          </Tag>
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-gray-100 pt-5">
        <MetaItem
          icon={<HiOutlineClock size={14} />}
          label="Hora"
          value={hora}
        />
        <MetaItem
          icon={<HiOutlineMapPin size={14} />}
          label="Ubicación"
          value={ubicacion}
        />
        {registrado_por && (
          <MetaItem
            icon={<HiOutlineUser size={14} />}
            label="Registrado por"
            value={registrado_por.nombre}
          />
        )}
      </div>
    </div>
  )
}

function PatientCard({ emergency }) {
  const { nombre, matricula, telefono } = emergency
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Paciente
      </Heading>
      <div className="mt-5 space-y-5">
        <DataField
          icon={<HiOutlineUser size={14} />}
          label="Nombre"
          value={nombre}
        />
        <DataField
          icon={<HiOutlineIdentification size={14} />}
          label="Matrícula"
          value={matricula}
        />
        <DataField
          icon={<HiOutlinePhone size={14} />}
          label="Teléfono"
          value={telefono}
        />
      </div>
    </section>
  )
}

function MedicalCard({ emergency }) {
  const { diagnostico, accion_realizada, tratamiento_admin } = emergency
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Información médica
      </Heading>
      <div className="mt-5 space-y-5">
        <DataField label="Diagnóstico" value={diagnostico} multiline />
        <DataField
          label="Acción realizada"
          value={accion_realizada}
          multiline
        />
        {tratamiento_admin && (
          <DataField
            label="Tratamiento administrativo"
            value={tratamiento_admin}
            multiline
          />
        )}
      </div>
    </section>
  )
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="text-5 flex items-center gap-2">
      <span className="font-medium text-zinc-400">{icon}</span>
      <span className="font-medium text-zinc-400">{label}:</span>
      <span className="font-medium text-zinc-800">{value ?? '---'}</span>
    </div>
  )
}

function DataField({ icon, label, value, multiline = false }) {
  return (
    <div className="space-y-1">
      <div className="text-5 flex items-center gap-1.5 font-medium text-zinc-400">
        {icon}
        <span>{label}</span>
      </div>
      <p
        className={`text-5 text-zinc-800 ${multiline ? 'whitespace-pre-wrap' : ''}`}
      >
        {value ?? <span className="text-zinc-300">—</span>}
      </p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-44 animate-pulse rounded-lg bg-zinc-100" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <div className="h-3 w-36 animate-pulse rounded bg-zinc-100" />
          <div className="h-8 w-72 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="mt-5 flex gap-8 border-t border-gray-100 pt-5">
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-48 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-52 animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-52 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </div>
  )
}
