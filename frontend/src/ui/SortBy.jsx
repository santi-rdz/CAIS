import { useSearchParams } from "react-router";
import Select from "./Select";

export default function SortBy({ options }) {
  const [serchParams, setSearchParams] = useSearchParams();
  const sortBy = serchParams.get("ordenarPor") || "";
  const currentOption = options[sortBy] || { label: "Ordenar por", value: "" };

  function onClick(option) {
    if (option.value === "clear") {
      serchParams.delete("ordenarPor");
      setSearchParams(serchParams);
      return;
    }

    serchParams.set("ordenarPor", option.value);
    setSearchParams(serchParams);
  }

  return <Select options={Object.values(options)} currentOption={currentOption} onClick={onClick} />;
}
