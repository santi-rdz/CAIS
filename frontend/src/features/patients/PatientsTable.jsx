import Table from '@components/Table'
import { usePatients } from './hooks/usePatients'
import PatientRow from './PatientRow'

export default function PatientsTable() {
  const { patients } = usePatients()
  return (
    <Table columns="27fr 15fr 15fr 10fr 2fr">
      <Table.Header>
        <div>Nombre</div>
        <div>Ultima actualización</div>
        <div>Fecha de nacimiento</div>
        <div>Género</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={patients}
        render={(patient) => <PatientRow key={patient.id} patient={patient} />}
      />
    </Table>
  )
}
