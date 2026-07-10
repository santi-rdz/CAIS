import { HiOutlineHeart } from 'react-icons/hi2'
import MonitoreoTab from '@features/patients/nutricion/tabs/MonitoreoTab'
import EvalActFisicaForm from '@features/patients/nutricion/forms/EvalActFisicaForm'
import { ACT_FISICA_COLUMNS } from '@features/patients/nutricion/constants'

// Resuelve columnas en el orden de `keys` (no en el de `columns`), para que el
// orden del resumen sea el declarado aquí y no dependa del orden de la fuente.
const pickCols = (columns, keys) =>
  keys.map((k) => columns.find((c) => c.key === k)).filter(Boolean)

const CONFIG = {
  rowsKey: 'eval_act_fisica_nutricion',
  urlParam: 'afEval',
  icon: HiOutlineHeart,
  title: 'Actividad Física',
  backLabel: 'Actividad física',
  columns: ACT_FISICA_COLUMNS,
  summary: pickCols(ACT_FISICA_COLUMNS, ['tipo', 'frecuencia', 'duracion']),
  FormComponent: EvalActFisicaForm,
  formName: 'af-form',
  deleteName: 'delete-af',
  modalSize: 'lg',
  formTitleNew: 'Nueva evaluación de actividad física',
  formTitleEdit: 'Editar evaluación de actividad física',
  deleteTitle: 'Eliminar evaluación de actividad física',
  emptyMessage: 'Sin evaluaciones de actividad física registradas',
  deleteFn: 'deleteActFisica',
  isDeletingFlag: 'isDeletingActFisica',
}

export default function ActFisicaTab({ historia }) {
  return <MonitoreoTab historia={historia} config={CONFIG} />
}
