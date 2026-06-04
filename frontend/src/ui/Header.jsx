import { HiOutlineBars3 } from 'react-icons/hi2'
import PatientSearchDropdown from '@features/patients/components/PatientSearchDropdown'
import NewPatientButton from '@features/patients/components/NewPatientButton'
import Logo from './Logo'

export function Header({ onMenuOpen, menuOpen }) {
  const hamburger = (
    <button
      onClick={onMenuOpen}
      aria-label="Abrir menú"
      aria-expanded={menuOpen}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
    >
      <HiOutlineBars3 size={22} />
    </button>
  )

  return (
    <header className="flex items-center gap-3 border-b border-zinc-200/60 p-3 [grid-area:header]">
      {/* Mobile (< sm): logo | hamburger */}
      <div className="hidden w-full items-center justify-between max-sm:flex">
        <Logo>
          <Logo.Heading />
          <Logo.Area />
        </Logo>
        {hamburger}
      </div>

      {/* Tablet (sm–lg): logo | search | hamburger */}
      <div className="hidden w-full items-center gap-3 max-lg:flex max-sm:hidden">
        <Logo>
          <Logo.Heading />
          <Logo.Area />
        </Logo>
        <PatientSearchDropdown className="grow" />
        {hamburger}
      </div>

      {/* Desktop (lg+): search | new patient */}
      <div className="flex grow max-lg:hidden">
        <PatientSearchDropdown className="w-[600px]" />
      </div>
      <div className="block max-lg:hidden">
        <NewPatientButton />
      </div>
    </header>
  )
}
