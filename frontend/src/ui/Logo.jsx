import caisLogo from "@assets/images/logo-cais.png";

export default function Logo({ children, isExpanded = true }) {
  return (
    <div className={`flex items-center transition-all duration-300 ease-in-out ${isExpanded ? " gap-2" : "gap-0"}`}>
      <img src={caisLogo} className="w-12" alt="" />
      <div className={`flex flex-col overflow-hidden ${isExpanded ? "w-32 opacity-100" : "w-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}

Logo.Heading = function Heading() {
  return <h1 className="font-lato text-2 leading-none text-green-800">CAIS</h1>;
};

Logo.Area = function Area() {
  return <span className="text-6 font-normal text-neutral-400">Medicina</span>;
};
