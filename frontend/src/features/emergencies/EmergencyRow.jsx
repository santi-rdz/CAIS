import Table from '@components/Table'
import Tag from '@components/Tag'
import RowActionsMenu from '@components/RowActionsMenu'
import Button from '@components/Button'
import Modal from '@components/Modal'
import DangerConfirm from '@components/DangerConfirm'
import { formatFecha, formatHora } from '@lib/dateHelpers'
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2'
import { useNavigate } from 'react-router'
import { useDeleteEmergency } from './hooks/useDeleteEmergency'

export default function EmergencyRow({ emergency }) {
  const {
    id,
    ubicacion,
    nombre,
    matricula,
    diagnostico,
    recurrente,
    fecha_hora,
  } = emergency

  const navigate = useNavigate()
  const { deleteEmergency, isDeleting } = useDeleteEmergency()

  const fecha = formatFecha(fecha_hora)
  const hora = formatHora(fecha_hora)

  function handleVerDetalles() {
    navigate(`/emergencias/${id}`)
  }

  return (
    <Table.Row>
      <div className="text-zinc-500">{fecha}</div>
      <div className="text-zinc-500">{hora}</div>
      <div>{ubicacion}</div>
      <div>
        <Stacked>
          <span>{nombre ?? '---'}</span>
          {matricula && (
            <span className="font-normal text-neutral-500">{matricula}</span>
          )}
          {recurrente && (
            <div className="w-fit">
              <Tag type="pendiente" size="xs">
                Recurrente
              </Tag>
            </div>
          )}
        </Stacked>
      </div>
      <div className="truncate pr-4">{diagnostico ?? '---'}</div>

      <Modal>
        <RowActionsMenu>
          <Button
            onClick={handleVerDetalles}
            variant="ghost"
            size="md"
            className="w-full justify-start"
          >
            <HiOutlineEye size={16} />
            Ver detalles
          </Button>
          <Modal.Open opens="delete-emergency">
            <Button variant="ghost" size="md" className="">
              <HiOutlineTrash size={16} />
              Eliminar emergencia
            </Button>
          </Modal.Open>
        </RowActionsMenu>

        <Modal.Content name="delete-emergency" noPadding variant="alert" icon={<HiOutlineTrash size={26} />}>
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

function Stacked({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>
}
