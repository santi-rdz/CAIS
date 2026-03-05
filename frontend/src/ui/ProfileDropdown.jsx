import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiBuildingLibrary,
  HiChevronRight,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import Tag from './Tag'

export default function ProfileDropdown({ user, onClose, logout }) {
  const navigate = useNavigate()
  const { nombre, correo, area, rol } = user ?? {}
  const formattedName = nombre ? `Dr. ${nombre}` : ''

  function handleNavigate(path) {
    onClose()
    navigate(path)
  }

  function handleLogout() {
    onClose()
    logout()
  }

  return (
    <div className="absolute bottom-full left-0 z-50 mb-2 w-64 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
      {/* User info */}
      <div className="flex items-center gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {formattedName}
          </p>
          <p className="truncate text-xs text-gray-400">{correo}</p>
          <div className="mt-2 space-x-2">
            <Tag rounded="full" size="xs" type="activo">
              {area}
            </Tag>
            <Tag rounded="full" size="xs" type="activo">
              {rol}
            </Tag>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100" />
      {/* Actions */}
      <div className="py-1">
        <button
          onClick={() => handleNavigate('/perfil')}
          className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span className="flex items-center justify-center rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-green-800">
            <HiOutlineUser
              size={16}
              className="text-gray-500 transition-colors group-hover:text-white"
            />
          </span>
          Mi Perfil <HiChevronRight className="ml-auto" />
        </button>
        <button
          onClick={() => handleNavigate('/configuracion')}
          className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          <span className="flex items-center justify-center rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-green-800">
            <HiOutlineCog6Tooth
              size={16}
              className="text-gray-500 transition-colors group-hover:text-white"
            />
          </span>
          Configuración <HiChevronRight className="ml-auto" />
        </button>
      </div>

      <div className="border-t border-gray-100" />
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <span className="flex items-center justify-center rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-red-600">
            <HiOutlineArrowRightOnRectangle
              size={16}
              className="text-gray-500 transition-colors group-hover:text-white"
            />
          </span>
          Cerrar Sesión
        </button>
      </div>
      <footer className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-xs leading-none text-gray-400">
        <HiBuildingLibrary size={14} />
        CAIS · UABC
      </footer>
    </div>
  )
}
