import { useState } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi2";
import MainNav from "./MainNav";
import ProfileCard from "./ProfileCard";
import Logo from "./Logo";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`flex flex-col gap-16 bg-neutral-50 p-6 transition-all duration-300 ease-in-out [grid-area:sidebar] ${isExpanded ? "w-65" : "w-24"}`}
    >
      <SidebarHeading isExpanded={isExpanded} handleToggle={() => setIsExpanded((prev) => !prev)} />
      <MainNav isExpanded={isExpanded} />
      <ProfileCard isExpanded={isExpanded} />
    </aside>
  );
}

function SidebarHeading({ isExpanded, handleToggle }) {
  return (
    <header className="relative flex flex-col">
      <Logo isExpanded={isExpanded}>
        <Logo.Heading />
        <Logo.Area />
      </Logo>
      <ToggleSidebarButton isExpanded={isExpanded} handleToggle={handleToggle} />
    </header>
  );
}

function ToggleSidebarButton({ isExpanded, handleToggle }) {
  return (
    <button
      onClick={handleToggle}
      className={`absolute top-1/2 right-0 w-fit -translate-y-1/2 transform cursor-pointer rounded-md bg-white p-1 transition-all duration-300 ease-in-out ${
        isExpanded ? "translate-x-2" : "left-1/2 -translate-x-1/2 translate-y-8"
      }`}
    >
      <HiChevronDoubleLeft
        size={18}
        className={`transition-transform duration-300 ${isExpanded ? "rotate-360" : "rotate-180"}`}
      />
    </button>
  );
}
