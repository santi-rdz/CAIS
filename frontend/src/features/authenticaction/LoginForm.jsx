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
        <Input
          offset="6"
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
          suffix={<DomainToggle isDomain={isUabcDomain} setIsDomain={setIsUabcDomain} />}
        />
      </FormRow>

      <FormRow htmlFor="password" label="Contraseña" error={errors?.password?.message}>
        <Input
          {...register("password", { required: "Ingresa tu contraseña" })}
          hasError={errors?.password?.message}
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          suffix={<ToggleShowPassword showPassword={showPassword} setShowPassword={setShowPassword} />}
        />
      </FormRow>
      <Footer />

      <Button className="mt-10 w-full">Iniciar Sesión</Button>
    </form>
  );
}

function ToggleShowPassword({ showPassword, setShowPassword, className, style }) {
  return (
    <button
      style={style}
      onClick={() => setShowPassword((p) => !p)}
      className={`cursor-pointer text-neutral-500 active:scale-105 ${className}`}
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
