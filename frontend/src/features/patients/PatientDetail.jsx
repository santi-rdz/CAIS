import { useNavigate } from 'react-router'
import {
  HiArrowLeft,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineIdentification,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineAcademicCap,
  HiOutlineClipboardDocument,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2'
import dayjs from 'dayjs'
import Button from '@components/Button'
import Heading from '@components/Heading'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import Tag from '@components/Tag'
import Tab from '@components/Tab'
import { formatFechaLong } from '@lib/dateHelpers'
import { usePatient } from './hooks/usePatient'
import { useEvolutionNotes } from './hooks/useEvolutionNotes'
import { useDeletePatient } from './hooks/useDeletePatient'
import PatientHistoria from './PatientHistoria'

export default function PatientDetail() {
  const { patient, isPending } = usePatient()
  const { deletePatient, isDeleting } = useDeletePatient()
  const navigate = useNavigate()

  if (isPending) return <Skeleton />
  if (!patient) return null

  const { id } = patient

  return (
    <Modal>
      <div className="space-y-5">
        <ActionBar
          onBack={() => navigate('/pacientes')}
          isDeleting={isDeleting}
        />
        <Tab defaultTab="historia">
          <PatientHeader patient={patient} />
          <div className="mt-4 space-y-4">
            <Tab.Panel value="historia" scrollable={false}>
              <PatientHistoria />
            </Tab.Panel>
            <Tab.Panel value="notas" scrollable={false}>
              <NotesPanel pacienteId={id} />
            </Tab.Panel>
            <Tab.Panel value="datos" scrollable={false}>
              <PersonalDataPanel patient={patient} />
            </Tab.Panel>
          </div>
        </Tab>
      </div>

      <Modal.Content name="delete-patient" noPadding>
        <DangerConfirm
          title="Eliminar paciente"
          description="¿Estás seguro? Esta acción no se puede deshacer."
          confirmLabel="Eliminar"
          onConfirm={() => deletePatient(id).then(() => navigate('/pacientes'))}
          isPending={isDeleting}
        />
      </Modal.Content>
    </Modal>
  )
}

function ActionBar({ onBack, isDeleting }) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
        <HiArrowLeft size={14} />
        Pacientes
      </Button>
      <div className="flex gap-2">
        <Modal.Open opens="edit-patient">
          <Button variant="secondary" size="md" className="gap-1.5">
            <HiOutlinePencilSquare size={14} />
            Editar
          </Button>
        </Modal.Open>
        <Modal variant="alert" icon={<HiOutlineTrash size={26} />}>
          <Modal.Open opens="delete-patient">
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
          <Modal.Content name="delete-patient" noPadding>
            <DangerConfirm
              title="Eliminar paciente"
              description="¿Estás seguro? Esta acción no se puede deshacer."
              confirmLabel="Eliminar"
              isPending={isDeleting}
            />
          </Modal.Content>
        </Modal>
      </div>
    </div>
  )
}

function PatientHeader({ patient }) {
  const {
    nombre,
    fecha_nacimiento,
    genero,
    es_externo,
    correo,
    telefono,
    nss,
  } = patient

  const age = fecha_nacimiento
    ? dayjs().diff(dayjs(fecha_nacimiento), 'year')
    : null

  const initials = nombre
    ? nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : null

  const subtitle = [
    age != null && `${age} años`,
    fecha_nacimiento && formatFechaLong(fecha_nacimiento),
    genero,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold tracking-tight text-green-800 select-none">
          {initials ?? <HiOutlineUser size={24} />}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Heading as="h2">{nombre ?? '---'}</Heading>
            {es_externo && (
              <Tag type="pendiente" size="sm">
                Externo
              </Tag>
            )}
          </div>
          {subtitle && <p className="text-5 mt-1 text-zinc-400">{subtitle}</p>}
          {(correo || telefono || nss) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {correo && (
                <MetaChip
                  icon={<HiOutlineEnvelope size={12} />}
                  value={correo}
                />
              )}
              {telefono && (
                <MetaChip
                  icon={<HiOutlinePhone size={12} />}
                  value={telefono}
                />
              )}
              {nss && (
                <MetaChip
                  icon={<HiOutlineIdentification size={12} />}
                  value={`NSS ${nss}`}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <Tab.List className="mt-5">
        <Tab.Trigger value="historia">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlineClipboardDocument size={13} />
            Historia médica
          </span>
        </Tab.Trigger>
        <Tab.Trigger value="notas">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlinePencilSquare size={13} />
            Notas de evolución
          </span>
        </Tab.Trigger>
        <Tab.Trigger value="datos">
          <span className="inline-flex items-center justify-center gap-1.5">
            <HiOutlineIdentification size={13} />
            Datos personales
          </span>
        </Tab.Trigger>
      </Tab.List>
    </div>
  )
}

function NotesPanel({ pacienteId }) {
  const { notes, isPending } = useEvolutionNotes(pacienteId)

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Modal.Open opens="create-note">
          <Button variant="primary" size="md" className="gap-1.5">
            <HiOutlinePlus size={14} />
            Nueva nota
          </Button>
        </Modal.Open>
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-zinc-100"
            />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          icon={<HiOutlineClipboardDocument size={24} />}
          message="Sin notas de evolución"
          hint="Registra la primera nota de esta consulta."
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}

function NoteCard({ note }) {
  const { motivo_consulta, ant_gine_andro } = note

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-700">
          <HiOutlineClipboardDocument size={14} />
        </div>
        <Heading as="h4">Nota de evolución</Heading>
      </div>
      <div className="mt-4 space-y-4">
        {motivo_consulta && (
          <DataField
            label="Motivo de consulta"
            value={motivo_consulta}
            multiline
          />
        )}
        {ant_gine_andro && (
          <DataField
            label="Antecedentes gin./androl."
            value={ant_gine_andro}
            multiline
          />
        )}
        {!motivo_consulta && !ant_gine_andro && (
          <p className="text-5 text-zinc-400">Sin contenido registrado.</p>
        )}
      </div>
    </div>
  )
}

function PersonalDataPanel({ patient }) {
  const {
    domicilio,
    ocupacion,
    estado_civil,
    nivel_educativo,
    religion,
    contacto_emergencia,
    telefono_emergencia,
    parentesco_emergencia,
  } = patient

  const hasContact =
    contacto_emergencia || telefono_emergencia || parentesco_emergencia

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Datos personales
      </Heading>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DataField
          icon={<HiOutlineMapPin size={14} />}
          label="Domicilio"
          value={domicilio}
          multiline
        />
        <DataField
          icon={<HiOutlineBriefcase size={14} />}
          label="Ocupación"
          value={ocupacion}
        />
        <DataField
          icon={<HiOutlineHeart size={14} />}
          label="Estado civil"
          value={estado_civil}
        />
        <DataField
          icon={<HiOutlineAcademicCap size={14} />}
          label="Nivel educativo"
          value={nivel_educativo}
        />
        <DataField label="Religión" value={religion} />
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <Heading as="h3" showBar>
          Contacto de emergencia
        </Heading>
        {hasContact ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DataField
              icon={<HiOutlineUser size={14} />}
              label="Nombre"
              value={contacto_emergencia}
            />
            <DataField
              icon={<HiOutlinePhone size={14} />}
              label="Teléfono"
              value={telefono_emergencia}
            />
            <DataField label="Parentesco" value={parentesco_emergencia} />
          </div>
        ) : (
          <EmptyState
            icon={<HiOutlineExclamationCircle size={24} />}
            message="Sin contacto de emergencia"
            hint="Edita el paciente para agregar un contacto."
          />
        )}
      </div>
    </div>
  )
}

function MetaChip({ icon, value }) {
  return (
    <span className="text-6 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-zinc-600">
      <span className="text-zinc-400">{icon}</span>
      {value}
    </span>
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

function EmptyState({ icon, message, hint }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-2 py-8 text-center">
      <span className="text-zinc-300">{icon}</span>
      <p className="text-5 font-medium text-zinc-500">{message}</p>
      <p className="text-6 text-zinc-400">{hint}</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-5">
      <div className="h-7 w-32 animate-pulse rounded-lg bg-zinc-100" />
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="h-16 w-16 animate-pulse rounded-full bg-zinc-100" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-64 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-40 animate-pulse rounded bg-zinc-100" />
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
              <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-100" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-zinc-100" />
            </div>
          </div>
        </div>
        <div className="mt-5 h-9 animate-pulse rounded-lg bg-zinc-100" />
      </div>
      <div className="space-y-3">
        <div className="h-28 animate-pulse rounded-xl bg-zinc-100" />
        <div className="h-28 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </div>
  )
}
