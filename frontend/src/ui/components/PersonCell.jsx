import { HiOutlineUser } from 'react-icons/hi2'

function Avatar({ children, className = '' }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      {children}
    </div>
  )
}

export default function PersonCell({ name, secondary, avatar }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {avatar}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium text-zinc-800" title={name ?? ''}>
          {name ?? '---'}
        </span>
        {secondary && (
          <span className="truncate text-sm text-zinc-500" title={secondary}>
            {secondary}
          </span>
        )}
      </div>
    </div>
  )
}

PersonCell.UserAvatar = function UserAvatar({ picture, email }) {
  return (
    <Avatar className="bg-gray-200 text-base uppercase font-medium text-zinc-600">
      {picture ? (
        <img src={picture} className="size-full object-cover" />
      ) : (
        email?.at(0)
      )}
    </Avatar>
  )
}

PersonCell.PatientAvatar = function PatientAvatar() {
  return (
    <Avatar className="bg-emerald-50 text-emerald-600">
      <HiOutlineUser size={18} strokeWidth={1.5} />
    </Avatar>
  )
}
