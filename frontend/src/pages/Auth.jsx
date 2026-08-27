import Logo from '@ui/Logo'
import { Outlet, useLocation } from 'react-router-dom'

export default function Auth() {
  return (
    <div className="login relative min-h-dvh">
      <div className="min-h-dvh w-[600px] space-y-12 overflow-y-auto bg-white p-10">
        <Logo>
          <Logo.Heading />
        </Logo>
        <Main />
      </div>
    </div>
  )
}

const routeMeta = {
  '/login': { title: 'Iniciar Sesión', subtitle: 'Bienvenido de vuelta!' },
  '/registro': {
    title: 'Crear cuenta',
    subtitle: 'Completa tu registro para acceder al sistema.',
  },
  '/recuperar-contrasena': {
    title: 'Restablecer contraseña',
    subtitle: 'Ingresa tu correo institucional y te enviaremos un enlace para restablecerla.',
  },
}

function resolveMeta(path) {
  // El token vive en la URL (/restablecer-contrasena/:token), por eso se matchea
  // por prefijo en lugar de por ruta exacta.
  if (path.startsWith('/restablecer-contrasena'))
    return { title: 'Crea una nueva contraseña', subtitle: 'Debe ser diferente a la anterior.' }
  return routeMeta[path] ?? { title: 'Registrarme', subtitle: 'Completa tu registro.' }
}

function Main() {
  const path = useLocation().pathname
  const { title, subtitle } = resolveMeta(path)
  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-1" data-testid="page-title-auth">
          {title}
        </h1>
        <p className="text-5 text-neutral-400">{subtitle}</p>
      </header>
      <Outlet />
    </main>
  )
}
