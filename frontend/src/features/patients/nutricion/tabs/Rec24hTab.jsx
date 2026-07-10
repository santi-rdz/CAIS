import { HiOutlineListBullet } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import Rec24hCard from '@features/patients/nutricion/components/Rec24hCard'
import Rec24hDetail from '@features/patients/nutricion/forms/Rec24hForm/Rec24hDetail'
import Rec24hForm from '@features/patients/nutricion/forms/Rec24hForm/Rec24hForm'
import { useRec24hs } from '@features/patients/nutricion/hooks/useRec24hs'
import { useRec24h } from '@features/patients/nutricion/hooks/useRec24h'
import { useDeleteRec24h } from '@features/patients/nutricion/hooks/useDeleteRec24h'

const CONFIG = {
  urlParam: 'recEval',
  itemProp: 'rec',
  useList: useRec24hs,
  listKey: 'recs',
  useItem: useRec24h,
  itemKey: 'rec',
  useDelete: useDeleteRec24h,
  deleteKey: 'deleteRec',
  Card: Rec24hCard,
  Detail: Rec24hDetail,
  Form: Rec24hForm,
  icon: HiOutlineListBullet,
  title: 'Recordatorio de 24 horas',
  formName: 'rec-24h-form',
  deleteName: 'delete-rec-24h',
  deleteTitle: 'Eliminar recordatorio de 24 horas',
  messages: {
    loadError: 'No se pudo cargar el recordatorio de 24 horas',
    listError: 'No se pudieron cargar los recordatorios de 24 horas',
    emptyMessage: 'Sin recordatorios de 24 horas',
    emptyHint: 'Registra el primer recordatorio de esta historia.',
    editError: 'No se pudo cargar el recordatorio a editar',
  },
}

export default function Rec24hTab({ historia }) {
  return <EndpointEvalTab historia={historia} config={CONFIG} />
}
