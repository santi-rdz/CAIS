import PatientsTable from '@features/patients/pages/PatientsTable'
import PatientsTableOperations from '@features/patients/pages/PatientsTableOperations'
import Heading from '@components/Heading'

export default function Patients() {
  return (
    <>
      <Heading className="mb-6">Pacientes</Heading>
      <PatientsTableOperations />
      <PatientsTable />
    </>
  )
}
