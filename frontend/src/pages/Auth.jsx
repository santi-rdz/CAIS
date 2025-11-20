import LoginForm from "@features/authenticaction/LoginForm";
import Logo from "@ui/Logo";
import { Outlet, useLocation } from "react-router";

export default function Login() {
  return (
    <div className="login relative min-h-dvh">
      <div className="h-dvh w-[540px] space-y-32 bg-white p-10">
        <Logo>
          <Logo.Heading />
        </Logo>
        <Main />
      </div>
    </div>
  );
}

function Main() {
  const path = useLocation().pathname;
  const title = path === "/login" ? "Iniciar Sesión" : "Registrarme";
  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-1">{title}</h1>
        <p className="text-5 text-neutral-400">Bienvenido de vuelta!</p>
      </header>
      <Outlet />
    </main>
  );
}
