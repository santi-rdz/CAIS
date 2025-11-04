import { useState } from "react";
import { isValidEmail } from "../lib/helpers";
import { Link } from "react-router";
import bgUabc from "../assets/images/uabc-bg.png";
import logoCais from "../assets/images/logo-cais.png";
import Button from "../ui/Button";
import { TbX, TbEyeOff } from "react-icons/tb";
import { HiOutlineXMark, HiOutlinePlus } from "react-icons/hi2";

export default function Login() {
  return (
    <div className="relative min-h-dvh">
      <div className="h-dvh w-[500px] space-y-32 bg-white p-10">
        <Header />
        <Main />
      </div>
      <BackGroundImg />
    </div>
  );
}

function BackGroundImg() {
  return (
    <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bgUabc})` }}></div>
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
      <Form />
    </main>
  );
}

function Form() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [isUabcDomain, setIsUabcDomain] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();

    if (!email) setEmailError(isUabcDomain ? "Ingresa tu usuario" : "Ingresa tu correo electronico");
    else if (!isUabcDomain && !isValidEmail(email)) setEmailError("Ingresa un correo valido");
    else setEmailError("");
    setPassError(!password ? "Ingresa tu contraseña" : "");
  }

  return (
    <form action="" onSubmit={handleSubmit} role="form">
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="text-5 mb-2 block">
            {isUabcDomain ? "Usuario" : "Correo electronico"}
          </label>
          <div className="relative">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="text"
              name="email"
              hasError={emailError}
              placeholder="eg. jhon.martinez39"
            />

            <div
              className={`group text-5 absolute top-1/2 right-2 -translate-y-1/2 rounded-md px-4 py-2 ${isUabcDomain ? "bg-white" : " bg-white/80 text-neutral-400"}`}
            >
              <span className={`${isUabcDomain ? "" : "line-through"}`}>@uabc.edu.mx</span>
              <button
                onClick={() => setIsUabcDomain(!isUabcDomain)}
                type="button"
                data-testid="toggle-domain"
                className="pointer-events-none absolute -top-1 -right-1 inline-flex size-5 scale-75 cursor-pointer items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-[opacity_transform] duration-300 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100"
              >
                {isUabcDomain ? <HiOutlineXMark /> : <HiOutlinePlus className="bg-white text-black" />}
              </button>
            </div>
          </div>
          {emailError && <span className="text-4 mt-0 inline-block text-red-500">{emailError}</span>}
        </div>
        <div>
          <label htmlFor="password" className="text-5 mb-2 block">
            Contraseña
          </label>
          <div className="relative">
            <Input
              value={password}
              hasError={passError}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="Contraseña"
            />
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-neutral-500"
              type="button"
              data-testid="toggle-passsword"
            >
              <TbEyeOff size={20} className="transition-transform duration-300 hover:scale-105" />
            </button>
          </div>
          {passError && <span className="text-4 mt-0 inline-block text-red-500">{passError}</span>}
        </div>
      </div>

      <div className="text-6 mt-4 flex justify-between font-medium">
        <span>Recordarme</span>

        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <Button className="mt-10">Iniciar Sesión</Button>
    </form>
  );
}

function Input({ hasError, ...props }) {
  return (
    <input
      className={`bg-black-50 w-full rounded-xl px-4 py-3 placeholder:text-[#808080] ${hasError ? "ring ring-red-400" : ""}`}
      {...props}
    />
  );
}
