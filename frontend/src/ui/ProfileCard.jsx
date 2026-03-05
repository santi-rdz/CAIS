import { useState, useCallback, useRef } from 'react'
import useUser from '@features/users/useUser'
import useClickOutside from '@hooks/useClickOutside'
import { HiOutlineChevronUpDown } from 'react-icons/hi2'
import Spinner from './Spinner'
import ProfileDropdown from './ProfileDropdown'

export default function ProfileCard({ isExpanded }) {
  const { user = {}, isPending, logout } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const closeTimeout = useRef(null)

  const close = useCallback(() => setIsOpen(false), [])
  const ref = useClickOutside(close)

  function handleMouseEnter() {
    clearTimeout(closeTimeout.current)
    setIsOpen(true)
  }

  function handleMouseLeave() {
    closeTimeout.current = setTimeout(() => setIsOpen(false), 80)
  }

  if (isPending) return <Spinner />

  const { nombre, correo, foto } = user

  const formattedName = `Dr. ${nombre}`

  return (
    <div
      ref={ref}
      className="relative mt-auto"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isOpen && (
        <>
          <ProfileDropdown user={user} onClose={close} logout={logout} />
          {/* Bridge invisible que cubre el gap mb-2 entre el dropdown y el botón */}
          <div className="absolute bottom-full left-0 h-2 w-full" />
        </>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex w-full cursor-pointer items-center bg-white shadow-sm transition-shadow duration-300 hover:shadow-md ${
          isExpanded
            ? 'justify-between gap-4 rounded-lg p-3'
            : 'w-fit justify-center rounded-full p-1'
        }`}
      >
        <div className="flex items-center">
          <picture className="block w-10 shrink-0">
            <img
              src={foto}
              className="w-full rounded-full object-cover"
              alt={nombre}
            />
          </picture>

          <div
            className={`flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'ml-2 w-24' : 'w-0'}`}
          >
            <span className="text-5 truncate text-start font-medium">
              {formattedName}
            </span>
            <span className="text-6 mt-0.5 max-w-[14ch] truncate text-neutral-400">
              {correo}
            </span>
          </div>
        </div>

        {isExpanded && (
          <HiOutlineChevronUpDown
            size={18}
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>
    </div>
  )
}
