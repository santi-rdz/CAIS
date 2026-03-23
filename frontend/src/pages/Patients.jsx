import PatientsTable from '@features/patients/PatientsTable'
import PatientsTableOperations from '@features/patients/PatientsTableOperations'
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
