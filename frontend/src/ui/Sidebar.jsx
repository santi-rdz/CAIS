import { useState } from 'react'
import { HiChevronDoubleLeft } from 'react-icons/hi2'
import MainNav from './MainNav'
import ProfileCard from './ProfileCard'
import Logo from './Logo'

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <aside
      className={`flex flex-col gap-8 border-r border-zinc-200/60 bg-white px-4 py-6 transition-all duration-300 ease-in-out [grid-area:sidebar] max-lg:hidden ${isExpanded ? 'w-[260px]' : 'w-20'}`}
    >
      <SidebarHeading
        isExpanded={isExpanded}
        handleToggle={() => setIsExpanded((prev) => !prev)}
      />
      <MainNav isExpanded={isExpanded} />
      <ProfileCard isExpanded={isExpanded} />
    </aside>
  )
}

function SidebarHeading({ isExpanded, handleToggle }) {
  return (
    <header
      className={`flex transition-all duration-300 ${isExpanded ? 'items-center justify-between' : 'flex-col items-center gap-3'}`}
    >
      <Logo isExpanded={isExpanded}>
        <Logo.Heading />
        <Logo.Area />
      </Logo>
      <ToggleSidebarButton
        isExpanded={isExpanded}
        handleToggle={handleToggle}
      />
    </header>
  )
}

function ToggleSidebarButton({ isExpanded, handleToggle }) {
  return (
    <button
      onClick={handleToggle}
      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-white text-green-800 shadow-xs ring ring-gray-100 duration-200 hover:scale-105 hover:shadow-lg"
    >
      <HiChevronDoubleLeft
        size={14}
        className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
      />
    </button>
  )
}
