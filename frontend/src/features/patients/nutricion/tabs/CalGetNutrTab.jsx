import { HiOutlineCalculator } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import CalGetNutrCard from '@features/patients/nutricion/components/CalGetNutrCard'
import CalGetNutrDetail from '@features/patients/nutricion/forms/CalGetNutrForm/CalGetNutrDetail'
import CalGetNutrForm from '@features/patients/nutricion/forms/CalGetNutrForm/CalGetNutrForm'
import { useCalGetNutrs } from '@features/patients/nutricion/hooks/useCalGetNutrs'
import { useCalGetNutr } from '@features/patients/nutricion/hooks/useCalGetNutr'
import { useDeleteCalGetNutr } from '@features/patients/nutricion/hooks/useDeleteCalGetNutr'

const CONFIG = {
  urlParam: 'calGetEval',
  itemProp: 'registro',
  useList: useCalGetNutrs,
  listKey: 'registros',
  useItem: useCalGetNutr,
  itemKey: 'registro',
  useDelete: useDeleteCalGetNutr,
  deleteKey: 'deleteRegistro',
  Card: CalGetNutrCard,
  Detail: CalGetNutrDetail,
  Form: CalGetNutrForm,
  icon: HiOutlineCalculator,
  title: 'Requerimientos nutricionales (GET)',
  formName: 'cal-get-nutr-form',
  deleteName: 'delete-cal-get-nutr',
  deleteTitle: 'Eliminar cálculo de GET nutricional',
  messages: {
    loadError: 'No se pudo cargar el cálculo de GET nutricional',
    listError: 'No se pudieron cargar los cálculos de GET nutricional',
    emptyMessage: 'Sin cálculos de GET nutricional',
    emptyHint: 'Registra el primer cálculo de esta historia.',
    editError: 'No se pudo cargar el cálculo a editar',
  },
}

export default function CalGetNutrTab({ historia }) {
  return <EndpointEvalTab historia={historia} config={CONFIG} />
}
