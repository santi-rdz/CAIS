import Table from '@ui/Table'
import Tag from '@ui/Tag'
import RowActionsMenu from '@ui/RowActionsMenu'
import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import { HiOutlineEye } from 'react-icons/hi2'
import { useNavigate } from 'react-router'
import Button from '@ui/Button'

export default function EmergencyRow({ emergency, openMenu, setOpenMenu }) {
  const {
    id,
    ubicacion,
    nombre,
    matricula,
    diagnostico,
    recurrente,
    fecha_hora,
  } = emergency
  console.log(diagnostico)
  const navigate = useNavigate()
  const isMenuOpen = openMenu === id

  const date = fecha_hora ? dayjs(fecha_hora) : null
  const fecha = date ? date.locale(es).format('DD MMMM YYYY') : '---'
  const hora = date ? date.format('HH:mm') : '---'

  function handleClick() {
    setOpenMenu(isMenuOpen ? null : id)
  }

  function handleVerDetalles() {
    setOpenMenu(null)
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

      <RowActionsMenu
        isOpen={isMenuOpen}
        onToggle={handleClick}
        onClose={() => setOpenMenu(null)}
      >
        <Button
          onClick={handleVerDetalles}
          variant="ghost"
          size="md"
          className="flex items-center gap-1 text-nowrap"
        >
          <HiOutlineEye size={16} />
          Ver detalles
        </Button>
      </RowActionsMenu>
    </Table.Row>
  )
}

function Stacked({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>
}
