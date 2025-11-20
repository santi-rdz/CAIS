import { NavLink } from "react-router";
import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineBookOpen,
} from "react-icons/hi2";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: HiOutlineSquares2X2,
  },
  {
    path: "/pacientes",
    name: "Pacientes",
    icon: HiOutlineUserGroup,
  },
  {
    path: "bitacora",
    name: "Bitácora",
    icon: HiOutlineBookOpen,
  },
  {
    path: "estadisticas",
    name: "Estadísticas",
    icon: HiOutlineChartBar,
  },
  {
    path: "usuarios",
    name: "Usuarios",
    icon: HiOutlineIdentification,
  },
];

export default function MainNav({ isExpanded }) {
  return (
    <nav>
      <ul className={`flex flex-col gap-2 ${isExpanded ? "" : "items-center"}`}>
        {routes.map((r) => (
          <NavLi route={r} key={r.path} isExpanded={isExpanded} />
        ))}
      </ul>
    </nav>
  );
}

function NavLi({ route, isExpanded }) {
  const { path, name, icon: Icon } = route;
  return (
    <li className="">
      <NavLink
        to={path}
        className={`text-4 group active-route:bg-green-600 active-route:pointer-events-none active-route:text-white hover:bg-white-mint relative flex items-center rounded-md px-4 py-3 tracking-wide duration-300 ${isExpanded ? "w-full gap-3" : "w-fit gap-0"}`}
      >
        <Icon size={24} className="group-hover:text-green-800" />
        <span
          className={`overflow-hidden font-medium transition-all duration-300 ease-in-out ${isExpanded ? "w-32" : "w-0"}`}
        >
          {name}
        </span>
        {!isExpanded && (
          <div className="bg-white-mint invisible absolute left-full ml-6 -translate-x-3 rounded-md px-2 py-1 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
            {name}
          </div>
        )}
      </NavLink>
    </li>
  );
}
