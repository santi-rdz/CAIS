import { NavLink } from 'react-router'
import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineXMark,
  HiMagnifyingGlass,
} from 'react-icons/hi2'
import Logo from './Logo'
import ProfileCard from './ProfileCard'
import NewPatientButton from '@features/patients/components/NewPatientButton'
import Input from '@components/Input'

const routes = [
  { path: '/dashboard', name: 'Dashboard', icon: HiOutlineSquares2X2 },
  { path: '/pacientes', name: 'Pacientes', icon: HiOutlineUserGroup },
  { path: '/emergencias', name: 'Emergencias', icon: HiOutlineBookOpen },
  { path: 'estadisticas', name: 'Estadísticas', icon: HiOutlineChartBar },
  { path: 'usuarios', name: 'Usuarios', icon: HiOutlineIdentification },
]

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 max-lg:block ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out max-lg:flex ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4">
          <Logo>
            <Logo.Heading />
            <Logo.Area />
          </Logo>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <HiOutlineXMark size={20} />
          </button>
        </div>

        {/* Search — mobile only, tablet has it in the header */}
        <div className="hidden border-b border-zinc-100 px-4 py-3 max-sm:block">
          <Input
            className="w-full"
            type="text"
            size="md"
            placeholder="Buscar paciente..."
            suffix={<HiMagnifyingGlass />}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {routes.map(({ path, name, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={onClose}
                  className="active-route:bg-green-100 active-route:text-green-800 active-route:border-l-green-800 flex items-center gap-3 rounded-md border-l-[3px] border-l-transparent px-3 py-3 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="text-4 font-medium">{name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* New patient */}
        <div className="border-t border-zinc-100 px-4 py-4">
          <NewPatientButton size="md" />
        </div>

        {/* Profile */}
        <div className="border-t border-zinc-100 px-4 py-4">
          <ProfileCard isExpanded={true} />
        </div>
      </aside>
    </>
  )
}
