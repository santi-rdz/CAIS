import Select from "./Select";

const options = [
  { label: "Pasante", value: "pasante" },
  { label: "Coordinador", value: "coordinador" },
];
export default function RoleSelect({ role, setRole }) {
  const selected = options.find((op) => op.value === role);

  return <Select options={options} value={selected} onChange={setRole} className="w-fit" />;
}
