import { useSearchParams } from "react-router";
import Select from "./Select";

export default function SortBy({ options }) {
  const [serchParams, setSearchParams] = useSearchParams();
  const sortBy = serchParams.get("ordenarPor") || "";
  const currenOption = options[sortBy] || { label: "Ordenar por", value: "" };

  function onClick(value) {
    if (value === "clear") {
      serchParams.delete("ordenarPor");
      setSearchParams(serchParams);
      return;
    }

    serchParams.set("ordenarPor", value);
    setSearchParams(serchParams);
  }

  return <Select options={options} currenOption={currenOption} onClick={onClick} />;
}
