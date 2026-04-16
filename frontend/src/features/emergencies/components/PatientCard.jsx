import DataField from '@ui/components/DataField'
import Heading from '@ui/components/Heading'
import {
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineUser,
} from 'react-icons/hi2'

export default function PatientCard({ emergency }) {
  const { nombre, matricula, telefono } = emergency
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Paciente
      </Heading>
      <div className="mt-5 space-y-5">
        <DataField
          icon={<HiOutlineUser size={14} />}
          label="Nombre"
          value={nombre}
        />
        <DataField
          icon={<HiOutlineIdentification size={14} />}
          label="Matrícula"
          value={matricula}
        />
        <DataField
          icon={<HiOutlinePhone size={14} />}
          label="Teléfono"
          value={telefono}
        />
      </div>
    </section>
  )
}
