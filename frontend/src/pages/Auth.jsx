import Logo from '@ui/Logo'
import { Outlet, useLocation } from 'react-router'

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
  '/registro': { title: 'Crear cuenta', subtitle: 'Completa tu registro para acceder al sistema.' },
}

function Main() {
  const path = useLocation().pathname
  const { title, subtitle } = routeMeta[path] ?? { title: 'Registrarme', subtitle: 'Completa tu registro.' }
  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-1">{title}</h1>
        <p className="text-5 text-neutral-400">{subtitle}</p>
      </header>
      <Outlet />
    </main>
  )
}
