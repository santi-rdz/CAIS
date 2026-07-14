import { HiOutlineArrowLeft, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import Button from '@components/Button'
import Heading from '@components/Heading'
import FieldsSection from '@features/patients/shared/sections/FieldsSection'
import { formatFecha } from '@lib/dateHelpers'
import { TPAN_PROGRESO_MAP } from '@features/patients/nutricion/constants'

export default function TpanDetail({ tpan, onBack, onEdit, onDelete }) {
  const progreso = tpan.progreso != null ? TPAN_PROGRESO_MAP[tpan.progreso] : null

  return (
    <div data-testid="tpan-detail">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex min-w-0 items-center gap-2 text-zinc-500">
          <button
            type="button"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-zinc-400 transition-colors hover:text-zinc-700"
          >
            <HiOutlineArrowLeft size={14} />
            <span className="text-5">TPAN</span>
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-5 font-semibold text-zinc-700">{formatFecha(tpan.fecha_eval)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="md"
            className="p-2 text-zinc-400 hover:text-red-600"
            aria-label="Eliminar TPAN"
            onClick={() => onDelete?.(tpan)}
          >
            <HiOutlineTrash size={16} />
          </Button>
          <Button variant="secondary" size="md" className="gap-1.5" onClick={() => onEdit?.(0)}>
            <HiOutlinePencilSquare size={14} />
            Editar TPAN
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <Heading as="h4" showBar>
            Evaluación y diagnóstico
          </Heading>
          <FieldsSection
            fields={[
              { label: 'Evaluación realizada', value: tpan.eval_realizada },
              { label: 'Observado', value: tpan.observacion },
              { label: 'Estándares comparativos', value: tpan.estandares_com },
              { label: 'Decisión tomada', value: tpan.decision },
            ]}
          />
        </section>

        <section className="space-y-3">
          <Heading as="h4" showBar>
            Problema nutricio (PES)
          </Heading>
          <FieldsSection
            fields={[
              { label: 'Problema nutricio identificado', value: tpan.problema_iden },
              {
                label: 'Progreso diagnóstico',
                value: progreso ? (
                  <span className="text-6 inline-flex rounded-md bg-teal-50 px-2 py-0.5 font-medium text-teal-700">
                    {progreso}
                  </span>
                ) : null,
              },
              { label: 'Causa del problema (asociado a…)', value: tpan.causa_probl },
              { label: 'Evidencia del problema (evidenciado por…)', value: tpan.evidencia_probl },
            ]}
          />
        </section>
      </div>
    </div>
  )
}
