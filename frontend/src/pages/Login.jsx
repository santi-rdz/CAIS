import { Link } from "react-router";
import bgUabc from "../assets/images/uabc-bg.png";
import logoCais from "../assets/images/logo-cais.png";
import Button from "../ui/Button";

export default function Login() {
  return (
    <div className="min-h-dvh relative ">
      <div className="bg-white w-[500px] p-10 h-dvh space-y-42">
        <header className="flex items-center gap-1 text-2">
          <img src={logoCais} className="w-14" />
          <h2 className=" font-lato text-green-800">CAIS</h2>
        </header>
        <main className="space-y-10 ">
          <header>
            <h1 className="text-1">Iniciar Sesión</h1>
            <p className="text-5 text-neutral-400">Bienvenido de vuelta!</p>
          </header>
          <form action="" className="">
            <div className="space-y-6">
              <label htmlFor="email" className="block text-5 mb-2">
                Usuario / Correo
              </label>
              <Input
                id="email"
                type="text"
                name="email"
                placeholder="eg. jhon.martinez39"
              />

              <label htmlFor="password" className="text-5 block mb-2">
                Contraseña
              </label>
              <Input id="password" type="password" placeholder="Contraseña" />
            </div>
            <div className="mt-4 flex justify-between text-6 font-medium">
              <span>Recordarme</span>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Button className="mt-10">Iniciar Sesión</Button>
          </form>
        </main>
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${bgUabc})` }}
      ></div>
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      className="bg-black-50 rounded-xl px-4 py-3 placeholder:text-[#808080] w-full"
      {...props}
    />
  );
}
