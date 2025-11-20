import { useEffect, useRef } from "react";

export default function useClickOutside(handleClick) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClick();
      }
    }

    document.addEventListener("click", handleClickOutside, true);

    return () => document.removeEventListener("click", handleClickOutside, true);
  }, [ref, handleClick]);

  return ref;
}
