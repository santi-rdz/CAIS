import { NavLink } from 'react-router'
import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineBookOpen,
} from 'react-icons/hi2'

const routes = [
  { path: '/dashboard', name: 'Dashboard', icon: HiOutlineSquares2X2 },
  { path: '/pacientes', name: 'Pacientes', icon: HiOutlineUserGroup },
  { path: '/emergencias', name: 'Emergencias', icon: HiOutlineBookOpen },
  { path: 'estadisticas', name: 'Estadísticas', icon: HiOutlineChartBar },
  { path: 'usuarios', name: 'Usuarios', icon: HiOutlineIdentification },
]

export default function BottomNav() {
  return (
    <nav className="border-t border-zinc-200/60 bg-white [grid-area:bottom-nav] lg:hidden">
      <ul className="flex h-16 items-stretch">
        {routes.map(({ path, name, icon: Icon }) => (
          <li key={path} className="flex flex-1">
            <NavLink
              to={path}
              className="active-route:text-green-800 flex flex-1 flex-col items-center justify-center gap-1 text-zinc-400 transition-colors duration-150 hover:text-zinc-600"
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`flex items-center justify-center rounded-full px-4 py-1 transition-colors duration-150 ${
                      isActive ? 'bg-green-100' : ''
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? 'text-green-800' : ''}
                    />
                  </div>
                  <span
                    className={`text-7 font-medium ${isActive ? 'text-green-800' : ''}`}
                  >
                    {name}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
