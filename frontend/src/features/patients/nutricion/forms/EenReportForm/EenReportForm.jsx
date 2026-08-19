import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { eenFormSchema } from '@schemas/eenReport'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { fillDefaults } from '@lib/utils'
import { EDAD_ADULTO } from '@features/patients/nutricion/constants'
import { useCreateEenReport } from '@features/patients/nutricion/hooks/useCreateEenReport'
import { useUpdateEenReport } from '@features/patients/nutricion/hooks/useUpdateEenReport'
import EvaluacionStep from '@features/patients/nutricion/forms/EenReportForm/steps/EvaluacionStep'
import DiagnosticoStep from '@features/patients/nutricion/forms/EenReportForm/steps/DiagnosticoStep'
import { buildEenDefaults } from '@features/patients/nutricion/forms/EenReportForm/formDefaults'
import {
  buildCreatePayload,
  buildEditPayload,
} from '@features/patients/nutricion/forms/EenReportForm/serialize'

const ADULTO_STEPS = ['Evaluación Nutricional', 'Diagnóstico Nutricional (PES)']
const KID_STEPS = ['Evaluación Nutricional']

const boolToSelect = (v) => (v === true ? 'true' : v === false ? 'false' : '')

// En create el tipo (adulto/kid) se deduce de la edad del paciente; el backend
// lo revalida. Debe coincidir con el backend (`edad !== null && edad >= 18`):
// sin fecha de nacimiento la edad es null → pediátrico, no adulto.
function isPatientAdulto(patient) {
  const edad = patient?.fecha_nacimiento
    ? dayjs().diff(dayjs(patient.fecha_nacimiento), 'year')
    : null
  return edad != null && edad >= EDAD_ADULTO
}

function getCreateDefaults(esAdulto) {
  return { ...buildEenDefaults(esAdulto), fecha_eval: dayjs() }
}

function buildEditDefaults(reporte, esAdulto) {
  const base = fillDefaults(buildEenDefaults(esAdulto), reporte)
  base.fecha_eval = reporte?.fecha_eval ? dayjs(reporte.fecha_eval) : dayjs()
  if (esAdulto) {
    base.diagnosticos = Array.isArray(reporte?.diagnosticos) ? reporte.diagnosticos : []
  } else {
    base.solicito_orient = boolToSelect(reporte?.solicito_orient)
  }
  return base
}

export default function EenReportForm({
  historiaId,
  patient,
  reporte,
  initialStep = 0,
  editContext = null,
  onCloseModal,
}) {
  const { createReporte, isCreating } = useCreateEenReport(historiaId)
  const { updateReporte, isUpdating } = useUpdateEenReport(historiaId)
  const isEdit = !!reporte
  const esAdulto = isEdit ? reporte.tipo === 'adulto' : isPatientAdulto(patient)
  const steps = esAdulto ? ADULTO_STEPS : KID_STEPS
  const defaultValues = isEdit ? buildEditDefaults(reporte, esAdulto) : getCreateDefaults(esAdulto)

  const stepForm = useStepForm(
    steps,
    steps.map(() => []),
    defaultValues,
    zodResolver(eenFormSchema(esAdulto)),
    initialStep
  )
  const {
    currStep,
    methods: {
      formState: { isDirty, dirtyFields },
    },
  } = stepForm

  async function onSubmit(data) {
    // Fecha inválida del DatePicker → se omite en vez de mandar 'Invalid Date'.
    const fecha = data.fecha_eval ? dayjs(data.fecha_eval) : null
    const fechaStr = fecha?.isValid() ? fecha.format('YYYY-MM-DD') : undefined
    const campos = { ...data }
    delete campos.fecha_eval

    if (isEdit) {
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()
      const payload = buildEditPayload({ fechaStr, campos, esAdulto, dirtyFields })
      // Nada efectivo que mandar (p.ej. solo una fecha inválida) → cierra sin PATCH.
      if (!Object.keys(payload).length) return onCloseModal?.()
      await updateReporte({ id: reporte.id, data: payload })
    } else {
      const payload = buildCreatePayload({ historiaId, fechaStr, campos, esAdulto })
      await createReporte(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title="Reporte de Evaluación, Diagnóstico y Tratamiento Nutricional"
      subtitle={esAdulto ? 'Adulto' : 'Pediátrico'}
      submitLabel={isEdit ? 'Actualizar reporte' : 'Guardar reporte'}
      steps={steps}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isCreating}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      {currStep === 0 ? (
        <EvaluacionStep esAdulto={esAdulto} />
      ) : (
        <DiagnosticoStep initialEditIndex={editContext} />
      )}
    </StepFormShell>
  )
}
