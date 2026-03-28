import { useStepForm } from '@hooks/useStepForm'
import AparatosSistemasStep from '../MedicalPatientForm/steps/AparatosSistemasStep'
import ExploracionFisicaStep from '../MedicalPatientForm/steps/ExploracionFisicaStep'
import StepFormShell from '../shared/StepFormShell'
import { useCreateEvolutionNote } from '../../hooks/useCreateEvolutionNote'
import MotivoConsultaStep from './steps/MotivoConsultaStep'
import PlanDiagnosticoStep from './steps/PlanDiagnosticoStep'

const STEPS = ['Consulta', 'Aparatos', 'Exploración', 'Plan']
const STEPS_FIELDS = [[], [], [], []]

const STEP_COMPONENTS = [
  MotivoConsultaStep,
  AparatosSistemasStep,
  ExploracionFisicaStep,
  PlanDiagnosticoStep,
]

const DEFAULT_VALUES = {
  // Step 1 – motivo + ant_gine_andro
  motivoConsulta: '',
  antGineAndro: '',
  // Step 2 – aparatos_sistemas
  as_neurologico: '',
  as_cardiovascular: '',
  as_respiratorio: '',
  as_hematologico: '',
  as_digestivo: '',
  as_musculoesqueletico: '',
  as_genitourinario: '',
  as_endocrinologico: '',
  as_metabolico: '',
  as_nutricional: '',
  // Step 3 – informacion_fisica
  if_peso: '',
  if_altura: '',
  if_paSistolica: '',
  if_paDiastolica: '',
  if_fc: '',
  if_fr: '',
  if_circCintura: '',
  if_circCadera: '',
  if_spO2: '',
  if_glucosaCapilar: '',
  if_temperatura: '',
  if_exploracionFisica: '',
  if_habitoExterior: '',
  // Step 4 – plan_estudio
  fechaGeneracion: null,
  planTratamiento: '',
  tratamiento: '',
  estudiosComplementarios: '',
  cie10Codes: [],
}

export default function EvolutionNoteForm({
  pacienteId,
  patientGenero,
  onCloseModal,
}) {
  const { createNote, isCreating } = useCreateEvolutionNote(pacienteId)
  const stepForm = useStepForm(STEPS, STEPS_FIELDS, DEFAULT_VALUES)
  const { currStep } = stepForm

  const StepComponent = STEP_COMPONENTS[currStep]

  async function onSubmit(data) {
    const aparatos = {
      neurologico: data.as_neurologico || null,
      cardiovascular: data.as_cardiovascular || null,
      respiratorio: data.as_respiratorio || null,
      hematologico: data.as_hematologico || null,
      digestivo: data.as_digestivo || null,
      musculoesqueletico: data.as_musculoesqueletico || null,
      genitourinario: data.as_genitourinario || null,
      endocrinologico: data.as_endocrinologico || null,
      metabolico: data.as_metabolico || null,
      nutricional: data.as_nutricional || null,
    }

    const fisica = {
      peso: Number(data.if_peso) || null,
      altura: Number(data.if_altura) || null,
      pa_sistolica: Number(data.if_paSistolica) || null,
      pa_diastolica: Number(data.if_paDiastolica) || null,
      fc: Number(data.if_fc) || null,
      fr: Number(data.if_fr) || null,
      circ_cintura: Number(data.if_circCintura) || null,
      circ_cadera: Number(data.if_circCadera) || null,
      sp_o2: Number(data.if_spO2) || null,
      glucosa_capilar: Number(data.if_glucosaCapilar) || null,
      temperatura: Number(data.if_temperatura) || null,
      exploracion_fisica: data.if_exploracionFisica || null,
      habito_exterior: data.if_habitoExterior || null,
    }

    const cie10Codes = data.cie10Codes.map((c) => c.codigo)

    await createNote({
      paciente_id: pacienteId,
      motivo_consulta: data.motivoConsulta || null,
      ant_gine_andro: data.antGineAndro || null,
      ...(Object.values(aparatos).some(Boolean) && {
        aparatos_sistemas: aparatos,
      }),
      ...(Object.values(fisica).some(Boolean) && {
        informacion_fisica: fisica,
      }),
      ...(data.fechaGeneracion ||
      data.planTratamiento ||
      data.tratamiento ||
      cie10Codes.length
        ? {
            plan_estudio: {
              generado_en: data.fechaGeneracion || null,
              plan_tratamiento: data.planTratamiento || null,
              tratamiento: data.tratamiento || null,
              cie10_codes: cie10Codes,
            },
          }
        : {}),
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
