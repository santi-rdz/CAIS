import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  notaEvolucionBaseSchema,
  aparatosSistemasSchema,
  informacionFisicaSchema,
  planEstudioSchema,
} from '@cais/shared/schemas/medicina/evolutionNote'
import { useStepForm } from '@hooks/useStepForm'
import AparatosSistemasStep from '../MedicalPatientForm/steps/AparatosSistemasStep'
import ExploracionFisicaStep from '../MedicalPatientForm/steps/ExploracionFisicaStep'
import StepFormShell from '../shared/StepFormShell'
import {
  APARATOS_DEFAULTS,
  INFORMACION_FISICA_DEFAULTS,
} from '../shared/formDefaults'
import { useCreateEvolutionNote } from '../../hooks/useCreateEvolutionNote'
import MotivoConsultaStep from './steps/MotivoConsultaStep'
import PlanDiagnosticoStep from './steps/PlanDiagnosticoStep'

const evolutionNoteFormSchema = z.object({
  ...notaEvolucionBaseSchema.shape,
  ...aparatosSistemasSchema.shape,
  ...informacionFisicaSchema.shape,
  ...planEstudioSchema.shape,
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
  ...APARATOS_DEFAULTS,
  // Step 3 – informacion_fisica
  ...INFORMACION_FISICA_DEFAULTS,
  // Step 4 – planes_estudio
  generado_en: null,
  plan_tratamiento: '',
  tratamiento: '',
  estudios_complementarios: '',
  cie10_codes: [],
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
    const aparatos_sistemas = {
      neurologico: data.neurologico ?? null,
      cardiovascular: data.cardiovascular ?? null,
      respiratorio: data.respiratorio ?? null,
      hematologico: data.hematologico ?? null,
      digestivo: data.digestivo ?? null,
      musculoesqueletico: data.musculoesqueletico ?? null,
      genitourinario: data.genitourinario ?? null,
      endocrinologico: data.endocrinologico ?? null,
      metabolico: data.metabolico ?? null,
      nutricional: data.nutricional ?? null,
    }

    const informacion_fisica = {
      peso: data.peso ?? null,
      altura: data.altura ?? null,
      pa_sistolica: data.pa_sistolica ?? null,
      pa_diastolica: data.pa_diastolica ?? null,
      fc: data.fc ?? null,
      fr: data.fr ?? null,
      circ_cintura: data.circ_cintura ?? null,
      circ_cadera: data.circ_cadera ?? null,
      sp_o2: data.sp_o2 ?? null,
      glucosa_capilar: data.glucosa_capilar ?? null,
      temperatura: data.temperatura ?? null,
      exploracion_fisica: data.exploracion_fisica ?? null,
      habito_exterior: data.habito_exterior ?? null,
    }

    const cie10_codes = (data.cie10_codes ?? []).map((c) => c.codigo)
    const hasPlan =
      data.generado_en ||
      data.plan_tratamiento ||
      data.tratamiento ||
      data.estudios_complementarios ||
      cie10_codes.length

    await createNote({
      paciente_id: pacienteId,
      motivo_consulta: data.motivo_consulta ?? null,
      ant_gine_andro: data.ant_gine_andro ?? null,
      ...(Object.values(aparatos_sistemas).some(Boolean) && {
        aparatos_sistemas,
      }),
      ...(Object.values(informacion_fisica).some(Boolean) && {
        informacion_fisica,
      }),
      ...(hasPlan && {
        plan_estudio: {
          generado_en: data.generado_en ?? null,
          plan_tratamiento: data.plan_tratamiento ?? null,
          tratamiento: data.tratamiento ?? null,
          estudios_complementarios: data.estudios_complementarios ?? null,
          cie10_codes,
        },
      }),
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
