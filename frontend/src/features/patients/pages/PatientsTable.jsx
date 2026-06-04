import Table from '@components/Table'
import { usePatients } from '@features/patients/hooks/usePatients'
import PatientRow from '@features/patients/pages/PatientRow'

export default function PatientsTable() {
  const { patients } = usePatients()
  return (
    <Table columns="27fr 15fr 15fr 10fr 2fr">
      <Table.Header>
        <div>Paciente</div>
        <div>Última actualización</div>
        <div>Edad y Nacimiento</div>
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
