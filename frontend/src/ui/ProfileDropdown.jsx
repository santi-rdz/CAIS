import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiBuildingLibrary,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import Tag from '@components/Tag'
import DropdownPanel from '@components/DropdownPanel'

const NAV_ITEMS = [
  { icon: HiOutlineUser, label: 'Mi Perfil', path: '/perfil' },
  { icon: HiOutlineCog6Tooth, label: 'Configuración', path: '/perfil?tab=configuracion' },
]

function DropdownNavItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100"
    >
      <Icon
        size={16}
        className="shrink-0 text-zinc-400 transition-colors group-hover:text-green-700"
      />
      {label}
    </button>
  )
}

function Divider() {
  return <div className="border-t border-zinc-100" />
}

export default function ProfileDropdown({ user, onClose, logout }) {
  const navigate = useNavigate()
  const { nombre, correo, area, rol, foto } = user ?? {}

  function handleNavigate(path) {
    onClose()
    navigate(path)
  }

  function handleLogout() {
    onClose()
    logout()
  }

  return (
    <DropdownPanel
      portal={false}
      className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4">
        {foto && (
          <picture className="block w-9 shrink-0">
            <img
              src={foto}
              className="w-full rounded-full object-cover"
              alt={nombre}
            />
          </picture>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {nombre ? `Dr. ${nombre}` : ''}
          </p>
          <p className="truncate text-xs text-zinc-400">{correo}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Tag rounded="full" size="xs" type="outline">{area}</Tag>
            <Tag rounded="full" size="xs" type="activo">{rol}</Tag>
          </div>
        </div>
      </div>

      <Divider />

      <div className="p-1.5">
        {NAV_ITEMS.map(({ icon, label, path }) => (
          <DropdownNavItem
            key={label}
            icon={icon}
            label={label}
            onClick={() => handleNavigate(path)}
          />
        ))}
      </div>

      <Divider />

      <div className="p-1.5">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
        >
          <HiOutlineArrowRightOnRectangle size={16} className="shrink-0" />
          Cerrar Sesión
        </button>
      </div>

      <Divider />

      <footer className="flex items-center gap-2 px-4 py-2.5 text-xs leading-none text-zinc-400">
        <HiBuildingLibrary size={13} />
        CAIS · UABC
      </footer>
    </DropdownPanel>
  )
}
