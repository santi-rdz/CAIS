import LoginForm from "@features/authenticaction/LoginForm";
import logoCais from "@assets/images/logo-cais.png";

export default function Login() {
  return (
    <div className="login relative min-h-dvh">
      <div className="h-dvh w-[500px] space-y-32 bg-white p-10">
        <Header />
        <Main />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="text-2 flex items-center gap-1">
      <img src={logoCais} className="w-14" />
      <h2 className="font-lato text-green-800">CAIS</h2>
    </header>
  );
}

function Main() {
  return (
    <main className="space-y-10">
      <header>
        <h1 className="text-1">Iniciar Sesión</h1>
        <p className="text-5 text-neutral-400">Bienvenido de vuelta!</p>
      </header>
      <LoginForm />
    </main>
  );
}
