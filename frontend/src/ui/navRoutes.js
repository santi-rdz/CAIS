import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineBookOpen,
} from 'react-icons/hi2'

/**
 * Single source of truth for navigation routes.
 * `shortName` is used in compact contexts (mobile menu, bottom nav).
 */
const navRoutes = [
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
    path: '/emergencias',
    name: 'Bitácora de emergencias',
    shortName: 'Emergencias',
    icon: HiOutlineBookOpen,
  },
  {
    path: '/estadisticas',
    name: 'Estadísticas',
    icon: HiOutlineChartBar,
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    icon: HiOutlineIdentification,
  },
]

export default navRoutes
