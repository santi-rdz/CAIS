import { useState } from 'react'
import { HiMagnifyingGlass, HiOutlineBars3 } from 'react-icons/hi2'
import Input from '@components/Input'
import NewPatientButton from '@features/patients/components/NewPatientButton'
import Logo from './Logo'
import MobileMenu from './MobileMenu'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const hamburger = (
    <button
      onClick={() => setMenuOpen(true)}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
    >
      <HiOutlineBars3 size={22} />
    </button>
  )

  return (
    <>
      <header className="flex items-center gap-3 border-b border-zinc-200/60 p-3 [grid-area:header]">
        {/* Desktop: search + new patient */}
        <div className="flex grow max-lg:hidden">
          <Input
            className="w-[600px]"
            type="text"
            size="md"
            placeholder="Buscar paciente..."
            suffix={<HiMagnifyingGlass />}
          />
        </div>
        <div className="block max-lg:hidden">
          <NewPatientButton />
        </div>

        {/* Tablet (sm–lg): logo | search | hamburger */}
        <div className="hidden w-full items-center gap-3 max-lg:flex max-sm:hidden">
          <Logo>
            <Logo.Heading />
            <Logo.Area />
          </Logo>
          <div className="grow">
            <Input
              className="w-full"
              type="text"
              size="md"
              placeholder="Buscar paciente..."
              suffix={<HiMagnifyingGlass />}
            />
          </div>
          {hamburger}
        </div>

        {/* Mobile (< sm): logo | hamburger */}
        <div className="hidden w-full items-center justify-between max-sm:flex">
          <Logo>
            <Logo.Heading />
            <Logo.Area />
          </Logo>
          {hamburger}
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
