export function Header() {
  return (
    <header className="[grid-area:header w-full]">
      {<input type="text" placeholder="Buscar paciente..." />}
      {
        <button className="text-3 left-0 h-11 w-[179px] rounded-xl bg-[#016239] font-bold text-white">
          + Nuevo paciente
        </button>
      }
    </header>
  );
}
