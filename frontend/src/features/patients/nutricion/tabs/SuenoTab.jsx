import { HiOutlineMoon } from 'react-icons/hi2'
import MonitoreoTab from '@features/patients/nutricion/tabs/MonitoreoTab'
import EvalSuenoForm from '@features/patients/nutricion/forms/EvalSuenoForm'
import { SUENO_COLUMNS } from '@features/patients/nutricion/constants'

// Resuelve columnas en el orden de `keys` (no en el de `columns`), para que el
// orden del resumen sea el declarado aquí y no dependa del orden de la fuente.
const pickCols = (columns, keys) =>
  keys.map((k) => columns.find((c) => c.key === k)).filter(Boolean)

const CONFIG = {
  rowsKey: 'eval_cal_sueno',
  urlParam: 'suenoEval',
  icon: HiOutlineMoon,
  title: 'Calidad del Sueño',
  backLabel: 'Sueño',
  columns: SUENO_COLUMNS,
  summary: pickCols(SUENO_COLUMNS, ['horas_sueno', 'clasif_horas_sueno']),
  FormComponent: EvalSuenoForm,
  formName: 'sueno-form',
  deleteName: 'delete-sueno',
  modalSize: 'md',
  formTitleNew: 'Nueva evaluación de sueño',
  formTitleEdit: 'Editar evaluación de sueño',
  deleteTitle: 'Eliminar evaluación de sueño',
  emptyMessage: 'Sin evaluaciones de sueño registradas',
  deleteFn: 'deleteSueno',
  isDeletingFlag: 'isDeletingSueno',
}

export default function SuenoTab({ historia }) {
  return <MonitoreoTab historia={historia} config={CONFIG} />
}
