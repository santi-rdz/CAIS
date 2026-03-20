import { useState } from 'react'
import {
  HiChevronDoubleLeft,
  HiMagnifyingGlass,
  HiOutlineXMark,
} from 'react-icons/hi2'
import MainNav from './MainNav'
import ProfileCard from './ProfileCard'
import Logo from './Logo'
import Input from '@components/Input'

export function Sidebar({ isOpen, onClose }) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-hidden={!isOpen || undefined}
        inert={!isOpen ? '' : undefined}
        className={`flex flex-col gap-8 border-r border-zinc-200/60 bg-white px-4 py-6 transition-all duration-300 ease-in-out [grid-area:sidebar] max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:z-50 max-lg:h-full max-lg:shadow-2xl lg:translate-x-0 ${isExpanded ? 'w-[260px]' : 'lg:w-20'} ${isOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'} `}
      >
        <SidebarHeading
          isExpanded={isExpanded}
          handleToggle={() => setIsExpanded((prev) => !prev)}
          onClose={onClose}
        />
        {/* Search — mobile only */}
        <div className="hidden max-sm:block">
          <Input
            className="w-full"
            type="text"
            size="md"
            placeholder="Buscar paciente..."
            suffix={<HiMagnifyingGlass />}
          />
        </div>

        <MainNav isExpanded={isExpanded} />

        <ProfileCard isExpanded={isExpanded} />
      </aside>
    </>
  )
}

function SidebarHeading({ isExpanded, handleToggle, onClose }) {
  return (
    <header
      className={`flex transition-all duration-300 ${isExpanded ? 'items-center justify-between' : 'flex-col items-center gap-3'}`}
    >
      <Logo isExpanded={isExpanded}>
        <Logo.Heading />
        <Logo.Area />
      </Logo>

      {/* Desktop: collapse toggle */}
      <button
        onClick={handleToggle}
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-white text-green-800 shadow-xs ring ring-gray-100 duration-200 hover:scale-105 hover:shadow-lg max-lg:hidden"
      >
        <HiChevronDoubleLeft
          size={14}
          className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
        />
      </button>

      {/* Mobile: close button */}
      <button
        onClick={onClose}
        aria-label="Cerrar menú"
        className="flex hidden h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 max-lg:flex"
      >
        <HiOutlineXMark size={20} />
      </button>
    </header>
  )
}
