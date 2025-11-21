import Heading from "@ui/Heading";

import Button from "@ui/Button";
import EmailsRegister from "./EmailsRegister";
import { useState } from "react";

export default function UserModal({ onCloseModal }) {
  const [activeTab] = useState("pre");
  return (
    <div className="w-[600px]">
      <header>
        <Heading as="h2">Enviar links de registro</Heading>
        <nav className="mt-6 flex gap-1 rounded-lg bg-gray-100 p-1">
          <TabButton tab="pre" activeTab={activeTab}>
            Pre-registro
          </TabButton>
          <TabButton tab="full" activeTab={activeTab}>
            Registro completo
          </TabButton>
        </nav>
      </header>
      <main className="mt-12">{activeTab === "pre" && <EmailsRegister />}</main>
      <footer className="mt-12 flex grow gap-2 justify-self-end">
        <Button type="secondary" onClick={onCloseModal}>
          Canelar
        </Button>
        <Button>Confirmar y enviar</Button>
      </footer>
    </div>
  );
}

function TabButton({ children, activeTab, tab }) {
  return (
    <button
      className={`text-5 flex-1 cursor-pointer rounded py-2 ${activeTab === tab ? "bg-green-800 text-white" : ""}`}
    >
      {children}
    </button>
  );
}
