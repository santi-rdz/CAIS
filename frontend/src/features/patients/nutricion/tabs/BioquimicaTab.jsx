import { HiOutlineBeaker } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import BioqCard from '@features/patients/nutricion/components/BioqCard'
import BioqDetail from '@features/patients/nutricion/forms/EvalBioquimicaForm/BioqDetail'
import EvalBioquimicaForm from '@features/patients/nutricion/forms/EvalBioquimicaForm/EvalBioquimicaForm'
import { useBiochemicalEvals } from '@features/patients/nutricion/hooks/useBiochemicalEvals'
import { useBiochemicalEval } from '@features/patients/nutricion/hooks/useBiochemicalEval'
import { useDeleteBiochemicalEval } from '@features/patients/nutricion/hooks/useDeleteBiochemicalEval'

const CONFIG = {
  urlParam: 'bioqEval',
  itemProp: 'evaluation',
  useList: useBiochemicalEvals,
  listKey: 'evaluations',
  useItem: useBiochemicalEval,
  itemKey: 'evaluation',
  useDelete: useDeleteBiochemicalEval,
  deleteKey: 'deleteEval',
  Card: BioqCard,
  Detail: BioqDetail,
  Form: EvalBioquimicaForm,
  icon: HiOutlineBeaker,
  title: 'Evaluación Bioquímica',
  formName: 'bioq-form',
  deleteName: 'delete-bioq-eval',
  deleteTitle: 'Eliminar evaluación bioquímica',
  listSkeletonHeight: 'h-[92px]',
  messages: {
    loadError: 'No se pudo cargar la evaluación',
    listError: 'No se pudieron cargar las evaluaciones bioquímicas',
    emptyMessage: 'Sin evaluaciones bioquímicas',
    emptyHint: 'Registra la primera evaluación de esta historia.',
    editError: 'No se pudo cargar la evaluación a editar',
  },
}

export default function BioquimicaTab({ historia }) {
  return <EndpointEvalTab historia={historia} config={CONFIG} />
}
