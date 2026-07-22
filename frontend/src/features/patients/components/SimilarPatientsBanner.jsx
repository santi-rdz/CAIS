import dayjs from 'dayjs'
import { HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2'
import { AREA_LABELS } from '@cais/shared/constants/users'
import { getInitials } from '@lib/utils'
import Button from '@components/Button'
import Heading from '@components/Heading'
import Tag from '@components/Tag'

function CandidateRow({ candidate, onSync }) {
  const pct = Math.round(candidate.score * 100)
  const nacimiento = dayjs(candidate.fecha_nacimiento)

  return (
    <li className="flex items-center gap-4 py-3">
      <span className="text-6 grid size-10 shrink-0 place-items-center rounded-full bg-green-100 font-medium text-green-800">
        {getInitials(candidate.nombre, candidate.apellidos)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-5 truncate font-medium text-gray-800">
          {candidate.nombre} {candidate.apellidos}
        </p>
        <div className="text-6 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-500">
          <span>{nacimiento.format('DD/MM/YYYY')}</span>
          <span aria-hidden>·</span>
          <span>{dayjs().diff(nacimiento, 'year')} años</span>
          <span aria-hidden>·</span>
          <span>{candidate.genero}</span>
          {candidate.areas.map((area) => (
            <Tag key={area} type="outline" size="xs">
              {AREA_LABELS[area] ?? area}
            </Tag>
          ))}
        </div>
      </div>

      <div className="w-28 shrink-0 max-sm:hidden">
        <div className="text-7 mb-1.5 flex items-center justify-between text-gray-400">
          <span>Coincidencia</span>
          <span className="font-medium text-green-800">{pct}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-green-800" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <Button size="sm" variant="primary" onClick={() => onSync(candidate)}>
        <HiOutlineArrowPathRoundedSquare size={15} />
        Sincronizar
      </Button>
    </li>
  )
}

export default function SimilarPatientsBanner({ candidates, onSync }) {
  return (
    <section
      role="status"
      className="shadow-card animate-in fade-in slide-in-from-top-2 mb-6 rounded-2xl border border-green-800/20 bg-gradient-to-r from-green-50/70 via-white to-white p-5 ring-1 ring-green-800/10 duration-300"
    >
      <div className="flex items-center justify-between gap-3">
        <Heading as="h4" showBar required>
          ¿Ya está registrado en otra área?
        </Heading>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <Tag type="pendiente" size="xs">
            {candidates.length === 1 ? '1 coincidencia' : `${candidates.length} coincidencias`}
          </Tag>
        </span>
      </div>
      <p className="text-6 mt-1 pl-3 text-gray-500">
        Encontramos {candidates.length === 1 ? 'un expediente parecido' : 'expedientes parecidos'}{' '}
        en otra área. Si es la misma persona, sincronízala para no duplicar su registro.
      </p>

      <ul className="mt-3 divide-y divide-gray-100">
        {candidates.map((c) => (
          <CandidateRow key={c.id} candidate={c} onSync={onSync} />
        ))}
      </ul>
    </section>
  )
}
