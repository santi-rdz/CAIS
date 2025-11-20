import { HiMagnifyingGlass, HiOutlinePlus } from "react-icons/hi2";
import Button from "./Button";
import Input from "./Input";

export function Header() {
  return (
    <header className="flex gap-0 border-b-[0.5px] border-b-gray-100 p-3 [grid-area:header]">
      <div className="grow">
        <Input
          className="w-[600px] justify-self-center"
          type="text"
          size="md"
          placeholder="Buscar paciente..."
          suffix={<HiMagnifyingGlass />}
        />
      </div>
      <Button className="col-start-3 ml-auto h-full place-self-end" size="md">
        <HiOutlinePlus size="16" strokeWidth="2.5" />
        Nuevo paciente
      </Button>
    </header>
  );
}
