import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'
import usePermissions from '@hooks/usePermissions'
import { AREAS } from '@cais/shared/constants/users'
import MedicalPatientForm from '@features/patients/medicina/forms/MedicalPatientForm/MedicalPatientForm'
import NutritionalPatientForm from '@features/patients/nutricion/forms/NutritionalPatientForm/NutritionalPatientForm'

const AREA_FORMS = {
  [AREAS.MEDICINA]: {
    form: <MedicalPatientForm />,
    modalSize: 'xl',
  },
  [AREAS.NUTRICION]: {
    form: <NutritionalPatientForm />,
    modalSize: 'xl',
  },
}

export default function NewPatientButton({ size = 'md', variant = 'primary', className }) {
  const { area } = usePermissions()
  const config = AREA_FORMS[area]

  if (!config) return null

  return (
    <Modal>
      <Modal.Open opens="new-patient">
        <Button size={size} variant={variant} className={className} data-testid="new-patient-btn">
          <HiOutlinePlus size={16} strokeWidth={2.5} />
          Nuevo paciente
        </Button>
      </Modal.Open>
      <Modal.Content name="new-patient" size={config.modalSize} noPadding>
        {config.form}
      </Modal.Content>
    </Modal>
  )
}
