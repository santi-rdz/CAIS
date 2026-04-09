import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { notaEvolucionBaseSchema } from '@cais/shared/schemas/medicina/evolutionNote'
import {
  aparatosSistemasSchema,
  informacionFisicaSchema,
  planEstudioSchema,
} from '@cais/shared/schemas/medicina/shared'
import { useStepForm } from '@hooks/useStepForm'
import AparatosSistemasStep from '../MedicalPatientForm/steps/AparatosSistemasStep'
import ExploracionFisicaStep from '../MedicalPatientForm/steps/ExploracionFisicaStep'
import StepFormShell from '../shared/StepFormShell'
import {
  APARATOS_DEFAULTS,
  INFORMACION_FISICA_DEFAULTS,
  PLAN_ESTUDIO_DEFAULTS,
} from '../shared/formDefaults'
import { useCreateEvolutionNote } from '../../hooks/useCreateEvolutionNote'
import MotivoConsultaStep from './steps/MotivoConsultaStep'
import PlanDiagnosticoStep from './steps/PlanDiagnosticoStep'

const evolutionNoteFormSchema = z.object({
  ...notaEvolucionBaseSchema.shape,
  aparatos_sistemas: aparatosSistemasSchema.optional(),
  informacion_fisica: informacionFisicaSchema.optional(),
  planes_estudio: planEstudioSchema.optional(),
})

const STEPS = ['Consulta', 'Aparatos', 'Exploración', 'Plan']
const STEPS_FIELDS = [[], [], [], []]

const STEP_COMPONENTS = [
  MotivoConsultaStep,
  AparatosSistemasStep,
  ExploracionFisicaStep,
  PlanDiagnosticoStep,
]

const DEFAULT_VALUES = {
  // Step 1 – notas_evolucion
  motivo_consulta: '',
  ant_gine_andro: '',
  // Step 2 – aparatos_sistemas
  aparatos_sistemas: APARATOS_DEFAULTS,
  // Step 3 – informacion_fisica
  informacion_fisica: INFORMACION_FISICA_DEFAULTS,
  // Step 4 – planes_estudio
  planes_estudio: PLAN_ESTUDIO_DEFAULTS,
}

export default function EvolutionNoteForm({
  pacienteId,
  patientGenero,
  onCloseModal,
}) {
  const { createNote, isCreating } = useCreateEvolutionNote(pacienteId)
  const stepForm = useStepForm(
    STEPS,
    STEPS_FIELDS,
    DEFAULT_VALUES,
    zodResolver(evolutionNoteFormSchema)
  )
  const { currStep } = stepForm

  const StepComponent = STEP_COMPONENTS[currStep]

  async function onSubmit(data) {
    const hasPlan =
      data.planes_estudio?.plan_tratamiento ||
      data.planes_estudio?.tratamiento ||
      data.planes_estudio?.estudios_complementarios ||
      data.planes_estudio?.cie10_codes?.length

    await createNote({
      paciente_id: pacienteId,
      motivo_consulta: data.motivo_consulta || undefined,
      ant_gine_andro: data.ant_gine_andro || undefined,
      ...(Object.values(data.aparatos_sistemas ?? {}).some(Boolean) && {
        aparatos_sistemas: data.aparatos_sistemas,
      }),
      ...(Object.values(data.informacion_fisica ?? {}).some(Boolean) && {
        informacion_fisica: data.informacion_fisica,
      }),
      ...(hasPlan && { planes_estudio: data.planes_estudio }),
    })
    onCloseModal?.()
  }

  return (
    <StepFormShell
      title="Nueva Nota de Evolución"
      submitLabel="Guardar nota"
      steps={STEPS}
      onSubmit={onSubmit}
      isPending={isCreating}
      onCloseModal={onCloseModal}
      {...stepForm}
    >
      <StepComponent patientGenero={patientGenero} />
    </StepFormShell>
  )
}
