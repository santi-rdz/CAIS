import { useState, useCallback } from 'react'
import useMe from '@features/users/hooks/useMe'
import useClickOutside from '@hooks/useClickOutside'
import useHoverOpen from '@hooks/useHoverOpen'
import { HiOutlineChevronUpDown } from 'react-icons/hi2'

import Spinner from './components/Spinner'
import ProfileDropdown from './ProfileDropdown'

export default function ProfileCard({ isExpanded }) {
  const { user = {}, isPending, logout } = useMe()
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const ref = useClickOutside(close)

  const { onEnter, onLeave } = useHoverOpen(open, close, 80)

  if (isPending) return <Spinner />

  const { nombre, apellidos, correo, foto } = user

  const formattedName = `Dr. ${[nombre, apellidos].filter(Boolean).join(' ')}`

  return (
    <div
      ref={ref}
      className="relative mt-auto"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
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
        className={`group flex w-full cursor-pointer items-center bg-gray-50 transition-all duration-200 ${
          isExpanded
            ? 'justify-between gap-4 rounded-lg border border-zinc-200 p-3 hover:border-zinc-300 hover:bg-zinc-100'
            : 'w-fit justify-center rounded-full p-1 hover:bg-zinc-100 max-lg:w-full max-lg:justify-between max-lg:gap-4 max-lg:rounded-lg max-lg:border max-lg:border-zinc-200 max-lg:p-3 max-lg:hover:border-zinc-300 max-lg:hover:bg-zinc-100'
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
            className={`flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'ml-2 w-24' : 'w-0 max-lg:ml-2 max-lg:w-24'}`}
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
        {!isExpanded && (
          <HiOutlineChevronUpDown
            size={18}
            className={`hidden shrink-0 transition-transform duration-200 max-lg:block ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>
    </div>
  )
}
