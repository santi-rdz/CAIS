import useUser from '@features/users/useUser'
import { HiOutlineChevronUpDown, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import Spinner from './Spinner'

export default function ProfileCard({ isExpanded }) {
  const { user = {}, isPending, logout } = useUser()
  const { name, email, picture } = user
  if (isPending) return <Spinner />

  return (
    <div
      className={`group mt-auto flex cursor-pointer items-center bg-white shadow-sm transition-shadow duration-300 hover:shadow-md ${
        isExpanded ? 'justify-between gap-4 rounded-lg p-3' : 'w-fit justify-center rounded-full p-1'
      }`}
    >
      <div className="flex items-center">
        <picture className={`block w-10`}>
          <img src={picture} className="w-full rounded-full object-cover" />
        </picture>

        <div
          className={`flex flex-col truncate transition-all duration-300 ease-in-out ${isExpanded ? 'ml-2 w-24' : 'w-0'}`}
        >
          <h1 className="text-4 text-start font-medium">{name}</h1>
          <span className="text-5 max-w-[14ch] truncate text-neutral-400">{email}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="flex items-center gap-2">
          <HiOutlineChevronUpDown size={18} className="duration-300 group-hover:scale-110" />
          <button
            onClick={logout}
            className="flex items-center gap-1 text-red-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-red-700"
            title="Cerrar sesión"
          >
            <HiOutlineArrowRightOnRectangle size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
