import { HiOutlinePlus } from 'react-icons/hi2'
import Button from '@components/Button'
import Modal from '@components/Modal'
import useUser from '@features/users/hooks/useUser'
import MedicalPatientForm from './MedicalPatientForm/MedicalPatientForm'

const AREA_FORMS = {
  medicina: {
    form: <MedicalPatientForm />,
    modalSize: 'xl',
  },
}

export default function NewPatientButton({
  size = 'md',
  variant = 'primary',
  className,
}) {
  const { user } = useUser()
  const area = user?.area?.toLowerCase()
  const config = AREA_FORMS[area]

  if (!config) return null

  return (
    <Modal>
      <Modal.Open opens="new-patient">
        <Button size={size} variant={variant} className={className}>
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
