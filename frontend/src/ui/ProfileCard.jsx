import userImg from "@assets/images/userImg.png";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

export default function ProfileCard({ isExpanded }) {
  return (
    <button
      className={`group mt-auto flex cursor-pointer items-center bg-white shadow-sm transition-shadow duration-300 hover:shadow-md ${
        isExpanded ? "justify-between gap-4 rounded-lg p-3" : "w-fit justify-center rounded-full p-1"
      }`}
    >
      <div className="flex items-center">
        <picture className={`block w-10`}>
          <img src={userImg} className="w-full rounded-full object-cover" />
        </picture>

        <div
          className={`flex flex-col truncate transition-all duration-300 ease-in-out ${isExpanded ? "ml-2 w-24" : "w-0"}`}
        >
          <h1 className="text-4 text-start font-medium">Samanta M.</h1>
          <span className="text-5 max-w-[14ch] truncate text-neutral-400">samanta.martinez@uabc.edu</span>
        </div>
      </div>

      {isExpanded && <HiOutlineChevronUpDown size={18} className="duration-300 group-hover:scale-110" />}
    </button>
  );
}
