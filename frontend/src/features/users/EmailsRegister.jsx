import Button from "@ui/Button";
import DomainToggle from "@ui/DomainToggle";
import Input from "@ui/Input";
import Select from "@ui/Select";
import { useState } from "react";
import { HiOutlineUserPlus, HiUserPlus } from "react-icons/hi2";

export default function EmailsRegister() {
  return (
    <form>
      <Input offset="0" suffix={<Suffix />} placeholder="Ingresa usuario" variant="outline-b" size="xl" className="" />
      <Button size="md" type="outline" className="mt-3 ring-gray-100">
        <HiOutlineUserPlus size="18" /> Agregar usurio
      </Button>
    </form>
  );
}

function Suffix({ className, style }) {
  return (
    <div style={style} className={`flex items-center gap-2 pb-4 ${className}`}>
      <DomainToggle isDomain className="relative rounded-lg border border-gray-200 py-2.5 font-medium shadow-xs" />
      <RoleSelector />
    </div>
  );
}

function RoleSelector() {
  const [currentOption, setCurrentOption] = useState({ label: "Pasante", value: "pasante" });
  function handleClick(value) {
    setCurrentOption(value);
  }
  return (
    <Select
      options={[
        { label: "Pasante", value: "pasante" },
        { label: "Coordinador", value: "coordinador" },
      ]}
      currentOption={currentOption}
      onClick={handleClick}
      className="w-fit"
    />
  );
}
