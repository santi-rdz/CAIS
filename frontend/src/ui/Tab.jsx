import { createContext, useContext, useState } from "react";
import Heading from "./Heading";

const TabContext = createContext();

export default function Tab({ children, defaultTab, options }) {
  const defaultOption = defaultTab ? options.find((op) => op.value === defaultTab) : options[0];
  const [activeOption, setActiveOption] = useState(defaultOption);

  return <TabContext.Provider value={{ activeOption, setActiveOption, options }}>{children}</TabContext.Provider>;
}

Tab.Header = function TabHeader({ children }) {
  return <header>{children}</header>;
};

Tab.Title = function TabTitle({ children }) {
  return <Heading as="h2">{children}</Heading>;
};

Tab.Options = function TabOptions() {
  const { options } = useContext(TabContext);

  return (
    <nav className="mt-6 flex gap-1 rounded-lg bg-gray-100 p-1">
      {options.map((option) => (
        <Tab.Button key={option.value} option={option} />
      ))}
    </nav>
  );
};

Tab.Button = function TabButton({ option }) {
  const { activeOption, setActiveOption } = useContext(TabContext);

  const isActive = activeOption.value === option.value;

  return (
    <button
      onClick={() => setActiveOption(option)}
      className={`text-5 flex-1 cursor-pointer rounded py-2 duration-300 ${
        isActive ? "bg-green-800 text-white" : "hover:bg-gray-200"
      }`}
    >
      {option.label}
    </button>
  );
};

Tab.Content = function TabContent({ onClose }) {
  const { activeOption } = useContext(TabContext);
  const ActiveComponent = activeOption.component;

  return <main className="mt-16">{ActiveComponent(onClose)}</main>;
};
