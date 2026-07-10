import dayjs from 'dayjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { physicalExamFormSchema } from '@schemas/physicalExam'
import { useStepForm } from '@hooks/useStepForm'
import StepFormShell from '@features/patients/shared/forms/StepFormShell'
import { omitEmpty, nullifyEmpty, fillDefaults } from '@lib/utils'
import { useCreatePhysicalExam } from '@features/patients/nutricion/hooks/useCreatePhysicalExam'
import { useUpdatePhysicalExam } from '@features/patients/nutricion/hooks/useUpdatePhysicalExam'
import MonitoreoPesoStep from '@features/patients/nutricion/forms/ExamFisicoForm/steps/MonitoreoPesoStep'
import SintomasSignosStep from '@features/patients/nutricion/forms/ExamFisicoForm/steps/SintomasSignosStep'
import SemiologiaStep from '@features/patients/nutricion/forms/ExamFisicoForm/steps/SemiologiaStep'
import GenitourinarioStep from '@features/patients/nutricion/forms/ExamFisicoForm/steps/GenitourinarioStep'
import { EXAM_FISICO_DEFAULTS } from '@features/patients/nutricion/forms/ExamFisicoForm/formDefaults'
import {
  buildPeso,
  serializeSintomas,
  parseSintomas,
} from '@features/patients/nutricion/forms/ExamFisicoForm/serialize'

const STEPS = [
  'Monitoreo de Peso',
  'Síntomas GI y Signos',
  'Evaluación Semiológica',
  'Sistema Genitourinario',
]

// Todos los campos son opcionales en el schema compartido: se avanza libre entre
// pasos y el submit final arma solo lo llenado.
const STEPS_FIELDS = [[], [], [], []]

const STEP_COMPONENTS = [MonitoreoPesoStep, SintomasSignosStep, SemiologiaStep, GenitourinarioStep]

function getCreateDefaults() {
  return { ...EXAM_FISICO_DEFAULTS, fecha: dayjs() }
}

// El detalle llega con los nombres de relación de Prisma; se traducen al shape
// de payload que consume el form (y el backend al enviar).
function buildEditDefaults(exam) {
  const source = {
    eval_perdida_peso: exam?.eval_perdida_peso_nutricion,
    signos_vitales: exam?.signos_vitales_nutricion,
    semiologia: exam?.eval_semiologia_nutricional,
    ...parseSintomas(exam?.eval_sintomas_gastroin_nutricion),
  }
  return {
    ...fillDefaults(EXAM_FISICO_DEFAULTS, source),
    fecha: exam?.fecha ? dayjs(exam.fecha) : dayjs(),
  }
}

export default function ExamFisicoForm({ historiaId, exam, initialStep = 0, onCloseModal }) {
  const { createExam, isCreating } = useCreatePhysicalExam(historiaId)
  const { updateExam, isUpdating } = useUpdatePhysicalExam(historiaId)
  const isEdit = !!exam
  const defaultValues = isEdit ? buildEditDefaults(exam) : getCreateDefaults()
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    defaultValues,
    zodResolver(physicalExamFormSchema),
    initialStep
  )
  const {
    currStep,
    methods: {
      formState: { isDirty },
    },
  } = stepForm

  const StepComponent = STEP_COMPONENTS[currStep]

  async function onSubmit(data) {
    if (isEdit) {
      const dirtyFields = stepForm.methods.formState.dirtyFields
      if (!Object.keys(dirtyFields).length) return onCloseModal?.()

      const payload = {}
      if (dirtyFields.fecha) payload.fecha = dayjs(data.fecha).format('YYYY-MM-DD')
      if (dirtyFields.eval_perdida_peso) {
        payload.eval_perdida_peso = nullifyEmpty(buildPeso(data.eval_perdida_peso))
      }
      if (dirtyFields.signos_vitales) {
        payload.signos_vitales = nullifyEmpty(data.signos_vitales)
      }
      if (dirtyFields.semiologia) {
        payload.semiologia = nullifyEmpty(data.semiologia)
      }
      // manyReplace: reenvía la lista completa (o [] para limpiarla) si cambió el
      // toggle o los síntomas.
      if (dirtyFields.presenta_sgi || dirtyFields.sintomas) {
        payload.eval_sintomas_gastroin = serializeSintomas(data) ?? []
      }

      await updateExam({ id: exam.id, data: payload })
    } else {
      const sintomas = serializeSintomas(data)
      const payload = {
        historia_paciente_id: historiaId,
        ...(data.fecha && { fecha: dayjs(data.fecha).format('YYYY-MM-DD') }),
        // Los 3 bloques to-one son claves requeridas por el schema (aunque queden
        // vacíos): se incluyen siempre; omitEmpty limpia sus campos internos.
        eval_perdida_peso: omitEmpty(buildPeso(data.eval_perdida_peso)),
        signos_vitales: omitEmpty(data.signos_vitales),
        semiologia: omitEmpty(data.semiologia),
        ...(sintomas && { eval_sintomas_gastroin: sintomas }),
      }

      await createExam(payload)
    }
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title={isEdit ? 'Editar Examen Físico' : 'Nuevo Examen Físico'}
      submitLabel={isEdit ? 'Actualizar examen' : 'Guardar examen'}
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={isEdit ? isUpdating : isCreating}
      isEdit={isEdit}
      isDirty={isDirty}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent />
    </StepFormShell>
  )
}
