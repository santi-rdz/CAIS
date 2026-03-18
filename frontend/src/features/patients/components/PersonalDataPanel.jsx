import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineAcademicCap,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2'
import Heading from '@components/Heading'
import DataField from './DataField'
import EmptyState from './EmptyState'

export default function PersonalDataPanel({ patient }) {
  const {
    domicilio,
    ocupacion,
    estado_civil,
    nivel_educativo,
    religion,
    contacto_emergencia,
    telefono_emergencia,
    parentesco_emergencia,
  } = patient

  const hasContact =
    contacto_emergencia || telefono_emergencia || parentesco_emergencia

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Heading as="h3" showBar>
        Datos personales
      </Heading>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DataField
          icon={<HiOutlineMapPin size={14} />}
          label="Domicilio"
          value={domicilio}
          multiline
        />
        <DataField
          icon={<HiOutlineBriefcase size={14} />}
          label="Ocupación"
          value={ocupacion}
        />
        <DataField
          icon={<HiOutlineHeart size={14} />}
          label="Estado civil"
          value={estado_civil}
        />
        <DataField
          icon={<HiOutlineAcademicCap size={14} />}
          label="Nivel educativo"
          value={nivel_educativo}
        />
        <DataField label="Religión" value={religion} />
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <Heading as="h3" showBar>
          Contacto de emergencia
        </Heading>
        {hasContact ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DataField
              icon={<HiOutlineUser size={14} />}
              label="Nombre"
              value={contacto_emergencia}
            />
            <DataField
              icon={<HiOutlinePhone size={14} />}
              label="Teléfono"
              value={telefono_emergencia}
            />
            <DataField label="Parentesco" value={parentesco_emergencia} />
          </div>
        ) : (
          <EmptyState
            icon={<HiOutlineExclamationCircle size={24} />}
            message="Sin contacto de emergencia"
            hint="Edita el paciente para agregar un contacto."
          />
        )}
      </div>
    </div>
  )
}
