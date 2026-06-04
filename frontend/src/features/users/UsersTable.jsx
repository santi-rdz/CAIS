import Table from '@components/Table'
import UserRow from '@features/users/UserRow'
import { useUsers } from '@features/users/hooks/useUsers'
import Pagination from '@components/Pagination'
import useMe from '@features/users/hooks/useMe'

export default function UsersTable() {
  const { users, count, isPending } = useUsers()
  const { user: me } = useMe()
  const isAdmin = me?.rol === 'ADMIN'

  if (isPending) return <UsersTableSkeleton />

  return (
    <Table columns={isAdmin ? '27fr 10fr 10fr 15fr 15fr 2fr' : '27fr 10fr 15fr 15fr 2fr'}>
      <Table.Header>
        <div>Usuario</div>
        <div>Rol</div>
        {isAdmin && <div>Área</div>}
        <div>Último login</div>
        <div>Estado</div>
        <div></div>
      </Table.Header>
      <Table.Body
        data={users}
        render={(user) => <UserRow user={user} key={user.id} isAdmin={isAdmin} />}
      />
      <Table.Footer>
        <Pagination count={count} />
      </Table.Footer>
    </Table>
  )
}

function UsersTableSkeleton() {
  return (
    <Table columns="0.3fr 3.4fr 1.2fr 1.6fr 1.6fr 0.2fr">
      <Table.Header>
        <div></div>
        <div>Usuario</div>
        <div>Rol</div>
        <div>Último login</div>
        <div>Estado</div>
      </Table.Header>
      <div className="divide-y divide-zinc-100 bg-white">
        {Array.from({ length: 5 }, (_, i) => (
          <Table.Row key={i}>
            <div className="size-10 animate-pulse rounded-full bg-zinc-100" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-32 animate-pulse rounded bg-zinc-100" />
              <div className="h-2.5 w-44 animate-pulse rounded bg-zinc-100" />
            </div>
            <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
            <div className="h-5 w-14 animate-pulse rounded-full bg-zinc-100" />
            <div className="size-6 animate-pulse rounded bg-zinc-100" />
          </Table.Row>
        ))}
      </div>
    </Table>
  )
}
