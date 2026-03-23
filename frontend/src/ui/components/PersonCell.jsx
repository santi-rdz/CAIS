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

function Stacked({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>
}

export default function PersonCell({ name, secondary, avatar }) {
  return (
    <div className="flex items-center gap-4">
      {avatar}
      <Stacked>
        <span>{name ?? '---'}</span>
        {secondary && (
          <span className="text-5 font-normal text-zinc-400">{secondary}</span>
        )}
      </Stacked>
    </div>
  )
}

PersonCell.UserAvatar = function UserAvatar({ picture, email }) {
  return (
    <Avatar className="bg-gray-200 text-base uppercase">
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
    <Avatar className="bg-green-100 text-green-600">
      <HiOutlineUser size={20} />
    </Avatar>
  )
}
