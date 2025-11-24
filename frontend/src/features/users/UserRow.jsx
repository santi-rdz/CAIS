import useClickOutside from '@hooks/useClickOutside'
import ConfirmDelete from '@ui/ConfirmDelete'
import Modal from '@ui/Modal'
import Table from '@ui/Table'
import Tag from '@ui/Tag'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { createPortal } from 'react-dom'
import { HiEllipsisVertical, HiTrash } from 'react-icons/hi2'
import useDeleteUser from './useDeleteUser'

export default function UserRow({ user, openMenu, setOpenMenu }) {
  const { name, role, lastLogin, email, status, picture, id } = user
  const { deleteUser, isPending } = useDeleteUser()
  const isMenuOpen = openMenu === id
  const hasPicture = Boolean(picture)
  const ref = useClickOutside(() => setOpenMenu(null), true)

  function handleClick() {
    setOpenMenu(isMenuOpen ? null : id)
  }
  return (
    <Table.Row>
      <UserPicture>
        {hasPicture ? (
          <img src={picture} className="size-full" />
        ) : (
          <div className="flex size-full items-center justify-center text-base uppercase">{email.at(0)}</div>
        )}
      </UserPicture>
      <div className="">
        <Stacked>
          <span>{name ? name : '---'}</span>
          <span className="font-normal text-neutral-500">{email}</span>
        </Stacked>
      </div>
      <div className="capitalize">{role}</div>
      <div>{lastLogin ? format(lastLogin, 'dd MMM yyyy', { locale: es }) : '---'}</div>
      <div>
        <Tag type={status}>{status}</Tag>
      </div>

      <Modal>
        <div className="relative">
          <button
            onClick={handleClick}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100"
          >
            <HiEllipsisVertical size={24} />
          </button>
          {isMenuOpen && (
            <div
              onClick={() => setOpenMenu(null)}
              ref={ref}
              className="absolute top-full right-0 z-10 mt-2 rounded-md bg-white px-3 py-2 shadow-lg"
            >
              <Modal.Open opens="delete">
                <button className="flex gap-2 px-4 py-3 text-nowrap">
                  <HiTrash />
                  Borrar usuario
                </button>
              </Modal.Open>
            </div>
          )}
        </div>
        <Modal.Content name="delete">
          <ConfirmDelete resourceName="usuario" onConfirm={() => deleteUser(id)} />
        </Modal.Content>
      </Modal>
    </Table.Row>
  )
}

function Stacked({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>
}

function UserPicture({ children }) {
  return (
    <div alt="User Picture" className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 object-cover">
      {children}
    </div>
  )
}
