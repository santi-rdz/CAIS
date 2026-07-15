import { HiOutlineScale } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import AntroCard from '@features/patients/nutricion/components/AntroCard'
import AntroDetail from '@features/patients/nutricion/forms/AntropometricaForm/AntroDetail'
import AntropometricaForm from '@features/patients/nutricion/forms/AntropometricaForm/AntropometricaForm'
import { useAnthropometricEvals } from '@features/patients/nutricion/hooks/useAnthropometricEvals'
import { useAnthropometricEval } from '@features/patients/nutricion/hooks/useAnthropometricEval'
import { useDeleteAnthropometricEval } from '@features/patients/nutricion/hooks/useDeleteAnthropometricEval'

const CONFIG = {
  urlParam: 'antroEval',
  itemProp: 'evalAntro',
  useList: useAnthropometricEvals,
  listKey: 'evals',
  useItem: useAnthropometricEval,
  itemKey: 'evalAntro',
  useDelete: useDeleteAnthropometricEval,
  deleteKey: 'deleteEval',
  Card: AntroCard,
  Detail: AntroDetail,
  Form: AntropometricaForm,
  icon: HiOutlineScale,
  title: 'Evaluación Antropométrica',
  formName: 'antro-form',
  deleteName: 'delete-antro',
  deleteTitle: 'Eliminar evaluación antropométrica',
  listSkeletonHeight: 'h-[96px]',
  messages: {
    loadError: 'No se pudo cargar la evaluación antropométrica',
    listError: 'No se pudieron cargar las evaluaciones antropométricas',
    emptyMessage: 'Sin evaluaciones antropométricas',
    emptyHint: 'Registra la primera evaluación de esta historia.',
    editError: 'No se pudo cargar la evaluación a editar',
  },
}

export default function AntropometricaTab({ historia, patient }) {
  return <EndpointEvalTab historia={historia} patient={patient} config={CONFIG} />
}
