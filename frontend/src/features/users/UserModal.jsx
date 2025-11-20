import Button from "@ui/Button";
import EmailsRegister from "./EmailsRegister";
import Tab from "@ui/Tab";

const options = [
  {
    label: "Pre-registro",
    value: "pre",
    component: <EmailsRegister />,
  },
  {
    label: "Registro completo",
    value: "full",
    component: <EmailsRegister />,
  },
];

export default function UserModal({ onCloseModal }) {
  return (
    <div className="w-[600px]">
      <Tab options={options} defaultTab="pre">
        <Tab.Header>
          <Tab.Title>Enviar Links de registro</Tab.Title>
          <Tab.Options />
        </Tab.Header>
        <Tab.Content />
      </Tab>
      <footer className="mt-12 flex grow gap-2 justify-self-end">
        <Button type="secondary" onClick={onCloseModal}>
          Canelar
        </Button>
        <Button>Confirmar y enviar</Button>
      </footer>
    </div>
  );
}

// export default function UserModal({ onCloseModal }) {
//   const [activeTab, setActiveTab] = useState("pre");
//   return (
//     <div className="w-[600px]">
//       <header>
//         <Heading as="h2">Enviar links de registro</Heading>
//         <nav className="mt-6 flex gap-1 rounded-lg bg-gray-100 p-1">
//           <TabButton tab="pre" activeTab={activeTab}>
//             Pre-registro
//           </TabButton>
//           <TabButton tab="full" activeTab={activeTab}>
//             Registro completo
//           </TabButton>
//         </nav>
//       </header>
//       <main className="mt-12">{activeTab === "pre" && <EmailsRegister />}</main>
//       <footer className="mt-12 flex grow gap-2 justify-self-end">
//         <Button type="secondary" onClick={onCloseModal}>
//           Canelar
//         </Button>
//         <Button>Confirmar y enviar</Button>
//       </footer>
//     </div>
//   );
// }
