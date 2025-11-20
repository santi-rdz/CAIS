import { cloneElement } from "react";

const sizes = {
  sm: "text-5 px-3.5 py-2 rounded-lg",
  md: "text-5 px-4 py-2.5 rounded-lg",
  lg: "text-5 px-4 py-3.5 rounded-xl",
  xl: "text-5 py-3",
};
const variants = {
  outline: "border bg-white shadow-xs border-gray-200 ",
  fill: "bg-black-50 ",
  "outline-b": "border-b border-b-gray-200  outline-none pb-4",
};
export default function Input({ hasError, suffix, variant = "fill", size = "lg", offset, className, ...props }) {
  return (
    <div className={`relative ${className} `}>
      <input
        className={`text-4 w-full duration-100 placeholder:text-[#808080] focus-visible:outline-[1.5px] ${hasError ? " focus-visible:outline-offset-2 focus-visible:outline-red-400" : " focus-visible:outline-green-900"} ${sizes[size]} ${variants[variant]} `}
        {...props}
      />
      {suffix &&
        cloneElement(suffix, {
          style: { right: `${offset ?? 12}px` },
          className: `absolute top-1/2  -translate-y-1/2 `,
        })}
    </div>
  );
}
