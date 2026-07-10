import { HiOutlineClipboardDocumentCheck } from 'react-icons/hi2'
import EndpointEvalTab from '@features/patients/nutricion/tabs/EndpointEvalTab'
import ExamFisCard from '@features/patients/nutricion/components/ExamFisCard'
import ExamFisDetail from '@features/patients/nutricion/forms/ExamFisicoForm/ExamFisDetail'
import ExamFisicoForm from '@features/patients/nutricion/forms/ExamFisicoForm/ExamFisicoForm'
import { usePhysicalExams } from '@features/patients/nutricion/hooks/usePhysicalExams'
import { usePhysicalExam } from '@features/patients/nutricion/hooks/usePhysicalExam'
import { useDeletePhysicalExam } from '@features/patients/nutricion/hooks/useDeletePhysicalExam'

const CONFIG = {
  urlParam: 'examEval',
  itemProp: 'exam',
  useList: usePhysicalExams,
  listKey: 'exams',
  useItem: usePhysicalExam,
  itemKey: 'exam',
  useDelete: useDeletePhysicalExam,
  deleteKey: 'deleteExam',
  Card: ExamFisCard,
  Detail: ExamFisDetail,
  Form: ExamFisicoForm,
  icon: HiOutlineClipboardDocumentCheck,
  title: 'Examen Físico',
  formName: 'exam-form',
  deleteName: 'delete-exam-fis',
  deleteTitle: 'Eliminar examen físico',
  messages: {
    loadError: 'No se pudo cargar el examen físico',
    listError: 'No se pudieron cargar los exámenes físicos',
    emptyMessage: 'Sin exámenes físicos',
    emptyHint: 'Registra el primer examen de esta historia.',
    editError: 'No se pudo cargar el examen a editar',
  },
}

export default function ExamFisicaTab({ historia }) {
  return <EndpointEvalTab historia={historia} config={CONFIG} />
}
