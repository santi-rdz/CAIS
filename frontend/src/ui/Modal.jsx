import useClickOutside from "@hooks/useClickOutside";
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

const ModalContext = createContext();

export default function Modal({ children }) {
  const [openName, setOpenName] = useState("userModal");
  const close = () => setOpenName("");
  const open = setOpenName;
  return <ModalContext value={{ openName, close, open }}>{children}</ModalContext>;
}

Modal.Open = function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
};

Modal.Content = function Content({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useClickOutside(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="bg- bg-bac bg-backdrop-color fixed top-0 right-0 size-full backdrop-blur-xs">
      <div className="fixed top-1/2 left-1/2 -translate-1/2 rounded-xl bg-white p-10 shadow-lg" ref={ref}>
        <button className="duaration-300 absolute top-3 right-5 p-1 hover:bg-gray-100">
          <HiXMark />
        </button>
        {cloneElement(children, { onCloseModal: close })}
      </div>
    </div>,
    document.body,
  );
};
