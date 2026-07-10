import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import NutrCard from '@features/patients/nutricion/components/NutrCard'
import NutrDetail from '@features/patients/nutricion/forms/EvalNutricionalForm/NutrDetail'
import EvalNutricionalForm from '@features/patients/nutricion/forms/EvalNutricionalForm/EvalNutricionalForm'
import { useNutritionalEvals } from '@features/patients/nutricion/hooks/useNutritionalEvals'
import { useNutritionalEval } from '@features/patients/nutricion/hooks/useNutritionalEval'
import { useDeleteNutritionalEval } from '@features/patients/nutricion/hooks/useDeleteNutritionalEval'

const CONFIG = {
  urlParam: 'nutrEval',
  itemProp: 'evaluation',
  useList: useNutritionalEvals,
  listKey: 'evaluations',
  useItem: useNutritionalEval,
  itemKey: 'evaluation',
  useDelete: useDeleteNutritionalEval,
  deleteKey: 'deleteEval',
  Card: NutrCard,
  Detail: NutrDetail,
  Form: EvalNutricionalForm,
  icon: HiOutlineClipboardDocumentList,
  title: 'Evaluación Nutricional',
  formName: 'nutr-form',
  deleteName: 'delete-nutr-eval',
  deleteTitle: 'Eliminar evaluación nutricional',
  messages: {
    loadError: 'No se pudo cargar la evaluación',
    listError: 'No se pudieron cargar las evaluaciones nutricionales',
    emptyMessage: 'Sin evaluaciones nutricionales',
    emptyHint: 'Registra la primera evaluación de esta historia.',
    editError: 'No se pudo cargar la evaluación a editar',
  },
}

export default function NutricionalTab({ historia }) {
  return <EndpointEvalTab historia={historia} config={CONFIG} />
}
