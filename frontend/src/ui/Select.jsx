import useClickOutside from "@hooks/useClickOutside";
import { useState } from "react";
import { HiChevronRight } from "react-icons/hi2";

export default function Select({ options, currentOption, onClick, className }) {
  const { label } = currentOption || {};
  const [showOptions, setShowOptions] = useState(false);
  const ref = useClickOutside(() => setShowOptions(false));
  console.log(options);
  return (
    <div className={`text-5 relative w-42 ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setShowOptions((show) => !show)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-medium shadow-xs duration-300 hover:shadow-md hover:ring hover:ring-green-800"
      >
        <span>{label}</span>
        <HiChevronRight
          size="16"
          className={`ml-2 inline-block duration-300 ${showOptions ? "rotate-270" : "rotate-90"}`}
        />
      </button>

      <div
        className={`absolute top-full right-0 z-10 mt-2 w-fit space-y-1 rounded-lg border border-neutral-100 bg-white p-2 shadow-md duration-300 ${showOptions ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"} `}
      >
        {options.map((option) => (
          <SelectOption
            key={option.value}
            setShowOptions={setShowOptions}
            currentOption={currentOption}
            option={option}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
}

function SelectOption({ option, currentOption, onClick, setShowOptions }) {
  const isActive = currentOption.value === option.value;
  const { label, value } = option;

  function handleClick() {
    onClick(option);
    setShowOptions(false);
  }

  return (
    <button
      type="button"
      className={`flex w-full cursor-pointer items-center gap-3 rounded-sm px-4 py-3 text-start hover:bg-gray-100 ${isActive ? "bg-white-mint pointer-events-none" : ""}`}
      onClick={handleClick}
    >
      {value !== "clear" && <Radio isActive={isActive} />}
      {label}
    </button>
  );
}

function Radio({ isActive }) {
  return (
    <span
      className={`${isActive ? " ring-green-900 after:absolute after:inset-0 after:m-auto after:size-[60%] after:rounded-full after:bg-green-900 after:content-['']" : "ring-gray-300"} relative inline-block size-2.5 rounded-full ring-2`}
    ></span>
  );
}
