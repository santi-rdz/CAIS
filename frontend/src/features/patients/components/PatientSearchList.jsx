import PatientSearchItem from '@features/patients/components/PatientSearchItem'

export default function PatientSearchList({ patients, onSelect, className = '' }) {
  return (
    <ul className={className}>
      {patients.map((patient) => (
        <PatientSearchItem key={patient.id} patient={patient} onSelect={onSelect} />
      ))}
    </ul>
  )
}
