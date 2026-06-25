import MonitoreoStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/MonitoreoStep'
import ActFisicaFormFields from '@features/patients/nutricion/forms/ActFisicaFormFields'

export default function EvalActFisicaStep() {
  return (
    <MonitoreoStep
      title="Actividad Física"
      name="eval_act_fisica_nutricion"
      Fields={ActFisicaFormFields}
    />
  )
}
