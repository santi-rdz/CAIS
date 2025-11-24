import Table from '@ui/Table'
import UserRow from './UserRow'
import { useUsers } from './useUsers'
import { useState } from 'react'

export default function UsersTable() {
  const { users, isPending } = useUsers()
  const [openMenu, setOpenMenu] = useState('3e272706-d62f-482a-afdb-b8d99631c534')

  if (isPending) return <p>Cargando usuarios...</p>

  return (
    <Table columns="0.3fr 3.4fr 1.2fr 1.6fr 1.6fr 0.2fr">
      <Table.Header>
        <div></div>
        <div>Nombre</div>
        <div>Rol</div>
        <div>Ultimo login</div>
        <div>Estado</div>
      </Table.Header>
      <Table.Body
        data={users}
        render={(user) => <UserRow user={user} key={user.id} openMenu={openMenu} setOpenMenu={setOpenMenu} />}
      />
      <Table.Footer>Pagination</Table.Footer>
    </Table>
  )
}
