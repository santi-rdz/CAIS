import { NavLink } from 'react-router'
import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineBookOpen,
} from 'react-icons/hi2'

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: HiOutlineSquares2X2,
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    icon: HiOutlineUserGroup,
  },
  {
    path: 'bitacora',
    name: 'Bitácora',
    icon: HiOutlineBookOpen,
  },
  {
    path: 'estadisticas',
    name: 'Estadísticas',
    icon: HiOutlineChartBar,
  },
  {
    path: 'usuarios',
    name: 'Usuarios',
    icon: HiOutlineIdentification,
  },
]

export default function MainNav({ isExpanded }) {
  return (
    <nav>
      <ul className={`flex flex-col gap-1 ${isExpanded ? '' : 'items-center'}`}>
        {routes.map((r) => (
          <NavLi route={r} key={r.path} isExpanded={isExpanded} />
        ))}
      </ul>
    </nav>
  )
}

function NavLi({ route, isExpanded }) {
  const { path, name, icon: Icon } = route
  return (
    <li>
      <NavLink
        to={path}
        className={`text-4 group active-route:pointer-events-none active-route:border-l-green-700 active-route:bg-green-50/60 active-route:text-green-800 relative flex items-center rounded-md border-l-[3px] border-l-transparent py-2.5 pr-3 pl-3 text-zinc-500 tracking-wide transition-all duration-200 hover:bg-zinc-100/70 hover:text-zinc-700 ${isExpanded ? 'w-full gap-3' : 'w-fit gap-0'}`}
      >
        <Icon size={20} className="shrink-0" />
        <span
          className={`overflow-hidden font-medium transition-all duration-300 ease-in-out ${isExpanded ? 'w-32' : 'w-0'}`}
        >
          {name}
        </span>
        {!isExpanded && (
          <div className="invisible absolute left-full z-10 ml-3 -translate-x-2 whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
            {name}
          </div>
        )}
      </NavLink>
    </li>
  )
}
