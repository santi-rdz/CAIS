import dayjs from 'dayjs'
import es from 'dayjs/locale/es'
import { useNavigate } from 'react-router'
import { getActivityStyle, buildActivityTitle, buildActivityNavPath } from '@lib/activityStyles'

function formatActivityDate(fechaHora) {
  if (!fechaHora) return '—'
  return dayjs(fechaHora).locale(es).format('DD MMM YYYY [•] HH:mm')
}

export default function ActivityCard({
  activity,
  layout = 'list',
  isLast = false,
}) {
  const navigate = useNavigate()
  const { accion, entidad, fecha_hora } = activity

  const style = getActivityStyle(accion, entidad)
  const Icon = style.icon
  const title = buildActivityTitle(accion, entidad)
  const navPath = buildActivityNavPath(activity)
  const dateStr = formatActivityDate(fecha_hora)

  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1)
  const clickable = Boolean(navPath)

  // ── Timeline / list mode ─────────────────────────────────────────
  if (layout === 'list') {
    return (
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}
          >
            <Icon size={18} />
          </div>
          {!isLast && <div className="mt-2 w-px flex-1 bg-gray-200" />}
        </div>

        <div className={`flex-1 ${!isLast ? 'mb-5' : ''}`}>
          <div
            onClick={clickable ? () => navigate(navPath) : undefined}
            className={[
              'rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-card',
              clickable ? 'cursor-pointer transition-colors hover:bg-gray-50' : '',
            ].join(' ')}
          >
            <p className="text-5 font-semibold text-zinc-800">{displayTitle}</p>
            <time className="text-6 mt-2 block text-zinc-400">{dateStr}</time>
          </div>
        </div>
      </div>
    )
  }

  // ── Grid mode ────────────────────────────────────────────────────
  return (
    <article
      onClick={clickable ? () => navigate(navPath) : undefined}
      className={[
        'flex h-[160px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card',
        clickable ? 'cursor-pointer transition-colors hover:bg-gray-50' : '',
      ].join(' ')}
    >
      <div className="flex shrink-0 items-start gap-3 px-4 pt-4 pb-2">
        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}
        >
          <Icon size={14} />
        </div>
        <p className="text-5 line-clamp-2 leading-tight font-semibold text-zinc-800">
          {displayTitle}
        </p>
      </div>
      <div className="flex-1 px-4 pb-1" />
      <div className="shrink-0 border-t border-gray-100 px-4 py-2.5">
        <time className="text-6 text-zinc-400">{dateStr}</time>
      </div>
    </article>
  )
}
