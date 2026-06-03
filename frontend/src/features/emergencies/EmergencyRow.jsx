import Table from '@components/Table'
import Tag from '@components/Tag'
import RowActionsMenu from '@components/RowActionsMenu'
import Button from '@components/Button'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import { formatFecha, formatHora } from '@lib/dateHelpers'
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useDeleteEmergency } from './hooks/useDeleteEmergency'

export default function EmergencyRow({ emergency }) {
  const { id, ubicacion, nombre, matricula, diagnostico, recurrente, fecha_hora } = emergency

  const navigate = useNavigate()
  const { deleteEmergency, isDeleting } = useDeleteEmergency()

  const fecha = formatFecha(fecha_hora)
  const hora = formatHora(fecha_hora)

  function handleVerDetalles() {
    navigate(`/emergencias/${id}`)
  }

  return (
    <Table.Row data-testid={`emergency-row-${id}`}>
      <div className="truncate font-medium text-zinc-700">{fecha}</div>
      <div className="text-sm text-zinc-500">{hora}</div>
      <div className="truncate text-zinc-700">{ubicacion}</div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className="max-w-[160px] truncate font-medium text-zinc-800 xl:max-w-[220px]"
            title={nombre ?? 'Paciente Externo'}
          >
            {nombre ?? 'Paciente Externo'}
          </span>
          {recurrente && (
            <Tag type="pendiente" size="xs" className="shrink-0">
              Recurrente
            </Tag>
          )}
        </div>
        {matricula && <span className="text-sm text-zinc-500">{matricula}</span>}
      </div>
      <div className="line-clamp-2 pr-4 text-sm leading-relaxed text-zinc-600" title={diagnostico}>
        {diagnostico ?? <span className="text-zinc-400 italic">Sin diagnóstico</span>}
      </div>

      <Modal>
        <RowActionsMenu>
          <Button
            onClick={handleVerDetalles}
            variant="ghost"
            size="md"
            className="w-full justify-start"
            data-testid="emergency-view-btn"
          >
            <HiOutlineEye size={16} />
            Ver detalles
          </Button>
          <Modal.Open opens="delete-emergency">
            <Button
              variant="ghost"
              size="md"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              data-testid="emergency-delete-btn"
            >
              <HiOutlineTrash size={16} />
              Eliminar emergencia
            </Button>
          </Modal.Open>
        </RowActionsMenu>

        <Modal.Content
          name="delete-emergency"
          noPadding
          variant="alert"
          icon={<HiOutlineTrash size={26} />}
        >
          <DangerConfirm
            title="Eliminar emergencia"
            description="¿Estás seguro de borrar esta emergencia?"
            confirmLabel="Eliminar"
            onConfirm={() => deleteEmergency(id)}
            isPending={isDeleting}
          />
        </Modal.Content>
      </Modal>
    </Table.Row>
  )
}
