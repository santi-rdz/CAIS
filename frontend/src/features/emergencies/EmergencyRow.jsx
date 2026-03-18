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

      <Modal variant="alert" icon={<HiOutlineTrash size={26} />}>
        <RowActionsMenu>
          <Button
            icon={<HiOutlineEye size={16} />}
            onClick={handleVerDetalles}
            variant="ghost"
            size="md"
            className="w-full justify-start"
          >
            Ver detalles
          </Button>
          <Modal.Open opens="delete-emergency">
            <Button
              icon={<HiOutlineTrash size={16} />}
              variant="ghost"
              size="md"
              className=""
            >
              Eliminar emergencia
            </Button>
          </Modal.Open>
        </RowActionsMenu>

        <Modal.Content name="delete-emergency" noPadding>
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
