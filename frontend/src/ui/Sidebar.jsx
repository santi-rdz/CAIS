import { NavLink } from "react-router";
import caisLogo from "../assets/images/logo-cais.png";
import userImg from "../assets/images/userImg.png";
import { TbSelector } from "react-icons/tb";
import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiChevronDoubleLeft,
  HiOutlineChevronUpDown,
} from "react-icons/hi2";
import { useState } from "react";

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

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <aside className={`flex flex-col gap-12 bg-neutral-50 p-6 [grid-area:sidebar]`}>
      <header className="relative flex flex-col items-center gap-2">
        <div className={`flex items-center transition-all duration-300 ease-in-out ${isExpanded ? "gap-2" : "gap-0"}`}>
          <img src={caisLogo} className="w-12" alt="" />
          <div className={`flex flex-col overflow-hidden ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}>
            <h1 className="font-lato text-2 leading-none text-green-800">CAIS</h1>
            <span className="text-6 font-normal text-neutral-400">Medicina</span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`absolute top-1/2 right-0 w-fit -translate-y-1/2 transform cursor-pointer rounded-md bg-white p-1 transition-all duration-300 ease-in-out ${
            isExpanded ? "translate-x-2" : "left-1/2 -translate-x-1/2 translate-y-8"
          }`}
        >
          <HiChevronDoubleLeft
            size={18}
            className={`transition-transform duration-300 ${isExpanded ? "rotate-360" : "rotate-180"}`}
          />
        </button>
      </header>
      <nav>
        <ul className={`flex flex-col gap-2 ${isExpanded ? "" : "items-center"}`}>
          {routes.map((r) => (
            <NavLi route={r} key={r.path} isExpanded={isExpanded} />
          ))}
        </ul>
      </nav>

      <button
        className={`group mt-auto flex cursor-pointer items-center justify-between gap-4 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md ${isExpanded ? "rounded-lg p-3 " : "rounded-full p-2"}`}
      >
        <div className="flex items-center">
          <picture className="block w-10">
            <img src={userImg} className="w-full" />
          </picture>

          <div
            className={`flex flex-col truncate transition-all duration-300 ease-in-out ${isExpanded ? "ml-2 w-24" : "w-0"}`}
          >
            <h1 className="text-4 text-start font-medium">Samanta M.</h1>
            <span className="text-5 max-w-[14ch] truncate text-neutral-400">samanta.martinez@uabc.edu</span>
          </div>
        </div>
        {isExpanded && <HiOutlineChevronUpDown size={18} className="duration-300 group-hover:scale-110" />}
      </button>
    </aside>
  );
}

function NavLi({ route, isExpanded }) {
  const { path, name, icon: Icon } = route;
  return (
    <li className="">
      <NavLink
        to={path}
        className={`text-4 group active-route:bg-green-600 active-route:pointer-events-none active-route:text-white hover:bg-white-mint relative flex items-center rounded-md px-4 py-3 duration-300 ${isExpanded ? "w-full gap-3" : "w-fit gap-0"}`}
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
