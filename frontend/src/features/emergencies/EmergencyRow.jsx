import useClickOutside from '@hooks/useClickOutside'
import Table from '@ui/Table'
import Tag from '@ui/Tag'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { HiEllipsisVertical, HiOutlineEye } from 'react-icons/hi2'
import { useNavigate } from 'react-router'

export default function EmergencyRow({ emergency, openMenu, setOpenMenu }) {
  const { id, ubicacion, nombre, matricula, diagnostico, recurrente, created_at } =
    emergency

  const navigate = useNavigate()
  const isMenuOpen = openMenu === id
  const ref = useClickOutside(() => setOpenMenu(null), true)

  const fecha = created_at
    ? format(new Date(created_at), 'dd MMM yyyy', { locale: es })
    : '---'

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
      <div>{ubicacion}</div>
      <div>
        <Stacked>
          <span>{nombre ?? '---'}</span>
          {matricula && (
            <span className="font-normal text-neutral-500">{matricula}</span>
          )}
        </Stacked>
      </div>
      <div className="truncate pr-4">{diagnostico}</div>
      <div>{recurrente && <Tag type="pendiente">Recurrente</Tag>}</div>

      <div className="relative">
        <button
          onClick={handleClick}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100"
        >
          <HiEllipsisVertical size={24} />
        </button>
        {isMenuOpen && (
          <div
            ref={ref}
            onClick={() => setOpenMenu(null)}
            className="absolute top-full right-0 z-10 mt-2 rounded-md bg-white px-3 py-2 shadow-lg"
          >
            <button
              onClick={handleVerDetalles}
              className="flex items-center gap-2 px-4 py-3 text-nowrap"
            >
              <HiOutlineEye size={16} />
              Ver detalles
            </button>
          </div>
        )}
      </div>
    </Table.Row>
  )
}

function Stacked({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>
}
