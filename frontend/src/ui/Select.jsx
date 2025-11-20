import useClickOutside from "@hooks/useClickOutside";
import { useState } from "react";
import { HiChevronRight } from "react-icons/hi2";

export default function Select({ options, currenOption, onClick }) {
  const { label } = currenOption || {};
  const [showOptions, setShowOptions] = useState(false);
  const ref = useClickOutside(() => setShowOptions(false));

  return (
    <div className="text-5 relative w-42" ref={ref}>
      <button
        onClick={() => setShowOptions((show) => !show)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium shadow-2xs duration-300 hover:shadow-md hover:ring hover:ring-green-800"
      >
        <span>{label}</span>
        <HiChevronRight
          size="16"
          className={`ml-2 inline-block duration-300 ${showOptions ? "rotate-270" : "rotate-90"}`}
        />
      </button>

      <div
        className={`absolute top-full right-0 z-10 mt-2 w-full space-y-1 rounded-lg border border-neutral-100 bg-white p-2 shadow-md duration-300 ${showOptions ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"} `}
      >
        {Object.values(options).map((option) => (
          <SelectOption
            key={option.value}
            setShowOptions={setShowOptions}
            currenOption={currenOption}
            option={option}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
}

function SelectOption({ option, currenOption, onClick, setShowOptions }) {
  const isActive = currenOption.value === option.value;
  const { label, value } = option;

  function handleClick() {
    onClick(value);
    setShowOptions(false);
  }

  return (
    <button
      className={`flex w-full cursor-pointer items-center gap-2 rounded-sm px-4 py-3 text-start hover:bg-gray-100 ${isActive ? "bg-white-mint pointer-events-none" : ""}`}
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
