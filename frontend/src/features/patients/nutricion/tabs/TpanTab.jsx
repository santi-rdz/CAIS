import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import TpanCard from '@features/patients/nutricion/components/TpanCard'
import TpanDetail from '@features/patients/nutricion/forms/TpanForm/TpanDetail'
import TpanForm from '@features/patients/nutricion/forms/TpanForm/TpanForm'
import { useTpans } from '@features/patients/nutricion/hooks/useTpans'
import { useTpan } from '@features/patients/nutricion/hooks/useTpan'
import { useDeleteTpan } from '@features/patients/nutricion/hooks/useDeleteTpan'

const CONFIG = {
  urlParam: 'tpanEval',
  itemProp: 'tpan',
  useList: useTpans,
  listKey: 'tpans',
  useItem: useTpan,
  itemKey: 'tpan',
  useDelete: useDeleteTpan,
  deleteKey: 'deleteTpan',
  Card: TpanCard,
  Detail: TpanDetail,
  Form: TpanForm,
  icon: HiOutlineClipboardDocumentList,
  title: 'TPAN',
  formName: 'tpan-form',
  deleteName: 'delete-tpan',
  deleteTitle: 'Eliminar TPAN',
  messages: {
    loadError: 'No se pudo cargar el registro TPAN',
    listError: 'No se pudieron cargar los registros TPAN',
    emptyMessage: 'Sin registros TPAN',
    emptyHint: 'Registra el primer TPAN de esta historia.',
    editError: 'No se pudo cargar el TPAN a editar',
  },
}

export default function TpanTab({ historia }) {
  return <EndpointEvalTab historia={historia} config={CONFIG} />
}
