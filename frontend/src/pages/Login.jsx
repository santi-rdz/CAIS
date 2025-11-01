import { Link } from "react-router";
import bgUabc from "../assets/images/uabc-bg.png";
import logoCais from "../assets/images/logo-cais.png";
import Button from "../ui/Button";
import { TbX, TbEyeOff } from "react-icons/tb";

export default function Login() {
  return (
    <div className="min-h-dvh relative">
      <div className="bg-white w-[500px] p-10 h-dvh space-y-32">
        <Header />
        <Main />
      </div>
      <BackGroundImg />
    </div>
  );
}

function BackGroundImg() {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center -z-10"
      style={{ backgroundImage: `url(${bgUabc})` }}
    ></div>
  );
}

function Header() {
  return (
    <header className="flex items-center gap-1 text-2">
      <img src={logoCais} className="w-14" />
      <h2 className=" font-lato text-green-800">CAIS</h2>
    </header>
  );
}

function Main() {
  return (
    <main className="space-y-10 ">
      <header>
        <h1 className="text-1">Iniciar Sesión</h1>
        <p className="text-5 text-neutral-400">Bienvenido de vuelta!</p>
      </header>
      <Form />
    </main>
  );
}

function Form() {
  return (
    <form action="">
      <div className="space-y-6">
        <label htmlFor="email" className="block text-5 mb-2">
          Usuario / Correo
        </label>
        <div className="relative">
          <Input
            id="email"
            type="text"
            name="email"
            placeholder="eg. jhon.martinez39"
          />
          <div className="group absolute  right-2 top-1/2 -translate-y-1/2 bg-white rounded-md px-4 py-2 text-5">
            <span>@uabc.edu.mx</span>
            <button
              type="button"
              className="group-hover:scale-100  pointer-events-none group-hover:pointer-events-auto inline-flex group-hover:opacity-100 transition-[opacity_transform] duration-300 cursor-pointer opacity-0 scale-75 items-center justify-center bg-white rounded-full size-5 absolute -top-1 -right-1  shadow-md"
            >
              <TbX />
            </button>
          </div>
        </div>
        <label htmlFor="password" className="text-5 block mb-2">
          Contraseña
        </label>
        <div className="relative">
          <Input id="password" type="password" placeholder="Contraseña" />
          <button
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2   text-neutral-500"
            type="button"
          >
            <TbEyeOff
              size={20}
              className="hover:scale-105 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-6 font-medium">
        <span>Recordarme</span>

        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <Button className="mt-10">Iniciar Sesión</Button>
    </form>
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
