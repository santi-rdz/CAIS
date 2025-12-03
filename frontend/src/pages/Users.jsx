import UsersTable from '@features/users/UsersTable'
import UserTableOperations from '@features/users/userTableOperations'
import Heading from '@ui/Heading'

export default function Users() {
  return (
    <>
      <header className="mb-6">
        <Heading as="h1">Usuarios</Heading>
      </header>

      <UserTableOperations />
      <UsersTable />
    </>
  )
}
