import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate } from 'react-router'
import { getActivityStyle, buildActivityTitle, buildActivityNavPath } from '@lib/activityStyles'

// ── Sub-components ────────────────────────────────────────────────────────────

function UserAvatar({ foto, email }) {
  const initial = email?.at(0)?.toUpperCase() ?? '?'
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-600 uppercase">
      {foto ? <img src={foto} alt={email} className="size-full object-cover" /> : initial}
    </div>
  )
}

function ActivityItem({ item }) {
  const navigate = useNavigate()
  const navPath = buildActivityNavPath(item)
  const style = getActivityStyle(item.accion, item.entidad)
  const Icon = style.icon
  const title = buildActivityTitle(item.accion, item.entidad)
  const timeAgo = formatDistanceToNow(new Date(item.fecha_hora), { addSuffix: true, locale: es })

  return (
    <div
      onClick={navPath ? () => navigate(navPath) : undefined}
      className={[
        'flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5',
        navPath ? 'cursor-pointer transition-colors hover:bg-gray-100' : '',
      ].join(' ')}
    >
      {/* Entity icon */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg} ${style.text}`}
      >
        <Icon size={15} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-800">
          <span className="font-semibold">{item.usuario}</span>{' '}
          <span className="text-gray-500">{title}</span>
        </p>
        <p className="text-xs text-neutral-400">{timeAgo}</p>
      </div>

      {/* User avatar */}
      <UserAvatar foto={item.foto} email={item.email} />
    </div>
  )
}

// ── Feed ──────────────────────────────────────────────────────────────────────

export default function ActivityFeed({ activity, loading }) {
  if (loading) {
    return (
      <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    )
  }

  if (!activity?.length) {
    return <p className="py-4 text-sm text-neutral-400">Sin actividad reciente</p>
  }

  return (
    <div className="max-h-full min-h-0 flex-1 space-y-2 overflow-y-auto pr-2 scrollbar-hover">
      {activity.map((item, i) => (
        <ActivityItem key={i} item={item} />
      ))}
    </div>
  )
}
