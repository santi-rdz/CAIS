import { HiOutlineDocumentText } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import EenReportCard from '@features/patients/nutricion/components/EenReportCard'
import EenReportDetail from '@features/patients/nutricion/forms/EenReportForm/EenReportDetail'
import EenReportForm from '@features/patients/nutricion/forms/EenReportForm/EenReportForm'
import { useEenReports } from '@features/patients/nutricion/hooks/useEenReports'
import { useEenReport } from '@features/patients/nutricion/hooks/useEenReport'
import { useDeleteEenReport } from '@features/patients/nutricion/hooks/useDeleteEenReport'

const CONFIG = {
  urlParam: 'eenEval',
  itemProp: 'reporte',
  useList: useEenReports,
  listKey: 'reportes',
  useItem: useEenReport,
  itemKey: 'reporte',
  useDelete: useDeleteEenReport,
  deleteKey: 'deleteReporte',
  Card: EenReportCard,
  Detail: EenReportDetail,
  Form: EenReportForm,
  icon: HiOutlineDocumentText,
  title: 'Reportes EEN',
  formName: 'een-report-form',
  deleteName: 'delete-een-report',
  deleteTitle: 'Eliminar reporte EEN',
  messages: {
    loadError: 'No se pudo cargar el reporte EEN',
    listError: 'No se pudieron cargar los reportes EEN',
    emptyMessage: 'Sin reportes EEN',
    emptyHint: 'Registra el primer reporte de esta historia.',
    editError: 'No se pudo cargar el reporte a editar',
  },
}

export default function EenReportTab({ historia, patient }) {
  return <EndpointEvalTab historia={historia} patient={patient} config={CONFIG} />
}
