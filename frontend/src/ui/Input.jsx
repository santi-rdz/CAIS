import { cloneElement } from "react";

const sizes = {
  sm: "text-5 px-3.5 py-2 rounded-md",
  md: "text-5 px-4 py-2.5 rounded-md",
  lg: "text-5 px-4 py-3.5 rounded-lg",
};
const variants = {
  outline: "border border-gray-300 ",
  fill: "bg-black-50 ",
};
export default function Input({ hasError, suffix, variant = "fill", size = "lg", className, ...props }) {
  return (
    <div className={`relative ${className} `}>
      <input
        className={`text-4 w-full duration-100 placeholder:text-[#808080] focus-visible:outline-[1.5px] ${hasError ? " focus-visible:outline-offset-2 focus-visible:outline-red-400" : " focus-visible:outline-green-900"} ${sizes[size]} ${variants[variant]} `}
        {...props}
      />
      {suffix && cloneElement(suffix, { className: "absolute top-1/2 right-4 -translate-y-1/2" })}
    </div>
  );
}
