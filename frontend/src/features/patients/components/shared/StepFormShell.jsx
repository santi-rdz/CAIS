import { FormProvider } from 'react-hook-form'
import { HiCheck, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import { toastErrorList } from '@lib/ApiError'
import Modal from '@components/Modal'
import ModalBody from '@components/ModalBody'
import ModalActions from '@components/ModalActions'
import Stepper from '@components/Stepper'

function toastFormErrors(errors) {
  const messages = Object.values(errors)
    .map((err) => err.message)
    .filter(Boolean)
  toastErrorList('Revisa los campos del formulario', messages)
}

/**
 * Estructura compartida para formularios multi-paso en modal.
 * Usado por MedicalPatientForm y EvolutionNoteForm.
 */
export default function StepFormShell({
  title,
  subtitle,
  description,
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
  isEdit = false,
  isDirty = false,
  onCloseModal,
  children,
}) {
  const showQuickSave = isEdit && !isLast
  const primaryDisabled = isPending || (isEdit && isLast && !isDirty)

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-0 flex-1 flex-col">
        <Modal.Heading>
          <Modal.Title>
            <span className="flex items-center gap-2">
              {title}
              {subtitle && (
                <span className="text-5 rounded-md bg-zinc-100 px-2 py-0.5 font-normal text-zinc-500">
                  {subtitle}
                </span>
              )}
            </span>
          </Modal.Title>
          {description && <Modal.Description>{description}</Modal.Description>}
          {steps.length > 1 && (
            <Stepper
              steps={steps}
              current={currStep}
              setCurrStep={handleStepClick}
              className="mt-4"
            />
          )}
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
            onClick: isLast
              ? handleSubmit(onSubmit, toastFormErrors)
              : handleNext,
            disabled: primaryDisabled,
            isLoading: isPending && isLast,
          }}
          secondaryAction={{
            label: 'Anterior',
            icon: <HiChevronLeft strokeWidth={1} />,
            onClick: () => setCurrStep((p) => p - 1),
            disabled: currStep === 0,
          }}
          quickSaveAction={
            showQuickSave
              ? {
                  label: 'Guardar cambios',
                  icon: <HiCheck strokeWidth={1} />,
                  onClick: handleSubmit(onSubmit, toastFormErrors),
                  disabled: !isDirty || isPending,
                  isLoading: isPending && isDirty,
                }
              : null
          }
        />
      </div>
    </FormProvider>
  )
}
