import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { HiOutlineEyeSlash, HiOutlineEye } from "react-icons/hi2";
import { isValidEmail } from "@lib/utils";
import Button from "@ui/Button";
import FormRow from "@ui/FormRow";
import DomainToggle from "@ui/DomainToggle";
import Input from "@ui/Input";

export default function LoginForm() {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const [isUabcDomain, setIsUabcDomain] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  function onSubmit(data) {
    // Login logic
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, () => console.log(errors))} role="form">
      <FormRow
        className="mb-6"
        htmlFor="email"
        error={errors?.email?.message}
        label={isUabcDomain ? "Usuario" : "Correo electronico"}
      >
        <div className="relative">
          <Input
            {...register("email", {
              required: isUabcDomain ? "Ingresa tu usuario" : "Ingresa tu correo electronico",
              validate: (email) => isUabcDomain || isValidEmail(email) || "Ingresa un correo valido",
            })}
            id="email"
            type="text"
            name="email"
            hasError={errors?.email?.message}
            placeholder={isUabcDomain ? "e.g. jhon.martinez29" : "e.g. jhon.martinez@example.com"}
            aria-label="Ingresar email"
          />
          <DomainToggle isDomain={isUabcDomain} setIsDomain={setIsUabcDomain} />
        </div>
      </FormRow>

      <FormRow htmlFor="password" label="Contraseña" error={errors?.password?.message}>
        <div className="relative">
          <Input
            {...register("password", { required: "Ingresa tu contraseña" })}
            hasError={errors?.password?.message}
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          />
          <ToggleShowPassword showPassword={showPassword} setShowPassword={setShowPassword} />
        </div>
      </FormRow>
      <Footer />

      <Button className="mt-10">Iniciar Sesión</Button>
    </form>
  );
}

function ToggleShowPassword({ showPassword, setShowPassword }) {
  return (
    <button
      onClick={() => setShowPassword((p) => !p)}
      className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-neutral-500 active:scale-105"
      type="button"
      data-testid="toggle-passsword"
    >
      {showPassword ? (
        <HiOutlineEye size={20} />
      ) : (
        <HiOutlineEyeSlash size={20} className="transition-transform duration-300 hover:scale-105" />
      )}
    </button>
  );
}

function Footer() {
  return (
    <div className="text-6 mt-3 flex justify-between font-medium">
      <span>Recordarme</span>

      <Link to="/forgot-password" className="text-blue-600 hover:underline">
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  );
}
