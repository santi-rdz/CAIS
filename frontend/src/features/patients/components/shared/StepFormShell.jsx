import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import Modal from '@components/Modal'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import Stepper from '@components/Stepper'

/**
 * Estructura compartida para formularios multi-paso en modal.
 * Usado por MedicalPatientForm y EvolutionNoteForm.
 */
export default function StepFormShell({
  title,
  submitLabel,
  steps,
  currStep,
  setCurrStep,
  handleNext,
  handleStepClick,
  isLast,
  methods,
  handleSubmit,
  getFormKeyDown,
  onSubmit,
  isPending = false,
  onCloseModal,
  children,
}) {
  return (
    <FormProvider {...methods}>
      <div className="flex min-h-0 flex-1 flex-col">
        <Modal.Heading>
          <Modal.Title>{title}</Modal.Title>
          <Stepper
            steps={steps}
            current={currStep}
            setCurrStep={handleStepClick}
            className="mt-4"
          />
        </Modal.Heading>

        <ModalBody>
          <form onKeyDown={getFormKeyDown(onSubmit, isPending)}>
            {children}
          </form>
        </ModalBody>

        <ModalActions
          onClose={onCloseModal}
          primaryAction={{
            label: isLast ? submitLabel : 'Siguiente',
            icon: isLast ? (
              <HiCheck strokeWidth={1} />
            ) : (
              <HiChevronRight strokeWidth={1} />
            ),
            iconPos: isLast ? 'left' : 'right',
            onClick: isLast ? handleSubmit(onSubmit) : handleNext,
            disabled: isPending,
          }}
          secondaryAction={{
            label: 'Anterior',
            icon: <HiChevronLeft strokeWidth={1} />,
            onClick: () => setCurrStep((p) => p - 1),
            disabled: currStep === 0,
          }}
        />
      </div>
    </FormProvider>
  )
}
