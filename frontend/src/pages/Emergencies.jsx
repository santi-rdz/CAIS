import EmergenciesTable from '@features/emergencies/EmergenciesTable'
import EmergenciesTableOperations from '@features/emergencies/EmergenciesTableOperations'
import Heading from '@components/Heading'

export default function Emergencies() {
  return (
    <>
      <header className="mb-6">
        <Heading as="h1">Bitácora de emergencias</Heading>
      </header>

      <EmergenciesTableOperations />
      <EmergenciesTable />
    </>
  )
}
