import { useState } from 'react'
import Table from '@ui/Table'
import Pagination from '@ui/Pagination'
import { useEmergencies } from './useEmergencies'
import EmergencyRow from './EmergencyRow'

const COLUMNS = '8fr 5fr 10fr 10fr 10fr 2fr'

export default function EmergenciesTable() {
  const { emergencies, count, isPending } = useEmergencies()
  const [openMenu, setOpenMenu] = useState(null)

  if (isPending) return <EmergenciesTableSkeleton />

  return (
    <Table columns={COLUMNS}>
      <Table.Header>
        <div>Fecha</div>
        <div>Hora</div>
        <div>Ubicación</div>
        <div>Paciente</div>
        <div>Diagnóstico</div>
      </Table.Header>
      <Table.Body
        data={emergencies}
        render={(emergency) => (
          <EmergencyRow
            key={emergency.id}
            emergency={emergency}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
          />
        )}
      />
      <Table.Footer>
        <Pagination count={count} />
      </Table.Footer>
    </Table>
  )
}

function EmergenciesTableSkeleton() {
  return (
    <Table columns={COLUMNS}>
      <Table.Header>
        <div>Fecha</div>
        <div>Hora</div>
        <div>Ubicación</div>
        <div>Paciente</div>
        <div>Diagnóstico</div>
      </Table.Header>
      <div className="divide-y divide-zinc-100 bg-white">
        {Array.from({ length: 8 }, (_, i) => (
          <Table.Row key={i}>
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
            <div className="h-3 w-12 animate-pulse rounded bg-zinc-100" />
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
            <div className="flex flex-col gap-2">
              <div className="h-3 w-28 animate-pulse rounded bg-zinc-100" />
              <div className="h-2.5 w-20 animate-pulse rounded bg-zinc-100" />
            </div>
            <div className="h-3 w-40 animate-pulse rounded bg-zinc-100" />
            <div className="size-6 animate-pulse rounded bg-zinc-100" />
          </Table.Row>
        ))}
      </div>
    </Table>
  )
}
