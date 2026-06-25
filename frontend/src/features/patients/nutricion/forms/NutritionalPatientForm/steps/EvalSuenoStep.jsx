import MonitoreoStep from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/MonitoreoStep'
import SuenoFormFields from '@features/patients/nutricion/forms/SuenoFormFields'

export default function EvalSuenoStep() {
  return <MonitoreoStep title="Calidad del Sueño" name="eval_cal_sueno" Fields={SuenoFormFields} />
}
