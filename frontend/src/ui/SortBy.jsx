import { useSearchParams } from "react-router";
import Select from "./Select";

export default function SortBy({ options }) {
  const [params, setParams] = useSearchParams();
  const current = params.get("ordenarPor");

  const selected = options.find((o) => o.value === current) || null;

  function handleChange(value) {
    if (value === "clear") {
      params.delete("ordenarPor");
      setParams(params);
    } else {
      params.set("ordenarPor", value);
      setParams(params);
    }
  }

  return <Select options={options} value={selected} onChange={handleChange} placeholder="Ordenar por" />;
}
