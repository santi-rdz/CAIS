import {
  HiOutlineBriefcase,
  HiOutlineHeart,
  HiOutlineAcademicCap,
  HiOutlineBanknotes,
} from 'react-icons/hi2'
import Heading from '@components/Heading'
import DataField from '@components/DataField'

// Datos personales del paciente de nutrición: solo los campos que captura el
// NutritionalPatientForm (correo y teléfono ya viven en el header).
export default function NutritionPersonalDataPanel({ patient }) {
  const { ocupacion, estado_civil, nivel_educativo, salario_dia } = patient

  return (
    <div className="shadow-card rounded-2xl border border-gray-100 bg-white p-6">
      <Heading as="h3" showBar>
        Datos personales
      </Heading>
      <div className="mt-5 grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        <DataField icon={<HiOutlineBriefcase size={14} />} label="Ocupación" value={ocupacion} />
        <DataField icon={<HiOutlineHeart size={14} />} label="Estado civil" value={estado_civil} />
        <DataField
          icon={<HiOutlineAcademicCap size={14} />}
          label="Escolaridad"
          value={nivel_educativo}
        />
        <DataField
          icon={<HiOutlineBanknotes size={14} />}
          label="Salario por día"
          value={salario_dia}
        />
      </div>
    </div>
  )
}
