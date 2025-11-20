import { HiOutlineXMark, HiOutlinePlus } from "react-icons/hi2";

export default function DomainToggle({ isDomain, setIsDomain, className, style }) {
  return (
    <div
      style={style}
      className={`group text-5 rounded-md px-4 py-2 ${isDomain ? "bg-white" : " bg-white/80 text-neutral-400"} ${className}`}
    >
      <span className={`${isDomain ? "" : "line-through"}`}>@uabc.edu.mx</span>
      <button
        onClick={() => setIsDomain(!isDomain)}
        type="button"
        data-testid="toggle-domain"
        className="pointer-events-none absolute -top-1 -right-1 inline-flex size-5 scale-75 cursor-pointer items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-[opacity_transform] duration-300 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 active:scale-80"
      >
        {isDomain ? <HiOutlineXMark /> : <HiOutlinePlus className="bg-white text-black" />}
      </button>
    </div>
  );
}
