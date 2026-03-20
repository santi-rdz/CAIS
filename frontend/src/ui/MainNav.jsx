import { NavLink } from 'react-router'
import navRoutes from './navRoutes'
import NewPatientButton from '@features/patients/components/NewPatientButton'

export default function MainNav({ isExpanded }) {
  return (
    <nav className="flex flex-col gap-4">
      <ul
        className={`flex flex-col gap-1 ${isExpanded ? '' : 'lg:items-center'}`}
      >
        {navRoutes.map((r) => (
          <NavLi route={r} key={r.path} isExpanded={isExpanded} />
        ))}
      </ul>
      <div className="hidden max-lg:block">
        <NewPatientButton size="lg" className="w-full" />
      </div>
    </nav>
  )
}

function NavLi({ route, isExpanded }) {
  const { path, name, icon: Icon } = route
  return (
    <li>
      <NavLink
        to={path}
        className={`text-4 group active-route:pointer-events-none active-route:border-l-green-800 active-route:bg-green-100 active-route:text-green-800 text-dark-gray relative flex items-center rounded-md border-l-[3px] border-l-transparent py-2.5 pr-3 pl-3 tracking-wide transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-700 ${isExpanded ? 'w-full gap-3' : 'w-fit gap-0 max-lg:w-full max-lg:gap-3'}`}
      >
        <Icon
          size={20}
          className="shrink-0 transition-colors duration-200 group-hover:text-green-700"
        />
        <span
          className={`truncate overflow-hidden font-medium transition-all duration-300 ease-in-out ${isExpanded ? 'w-32' : 'w-0 max-lg:w-32'}`}
        >
          {name}
        </span>
        {!isExpanded && (
          <div className="invisible absolute left-full z-10 ml-3 -translate-x-2 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 max-lg:hidden">
            {name}
          </div>
        )}
      </NavLink>
    </li>
  )
}
