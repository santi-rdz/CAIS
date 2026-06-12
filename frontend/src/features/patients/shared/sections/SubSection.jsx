// Sub-sección consistente para las tabs de la historia. El encabezado es un
// marcador discreto (no el heading display, que dominaba sobre el contenido):
// barra sutil + título semibold en zinc-700, para que la jerarquía sea
// encabezado → valor → label sin que el título se robe el protagonismo.
export default function SubSection({ title, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-3.5 w-1 rounded-full bg-zinc-300" />
        <h4 className="text-4 font-semibold tracking-tight text-zinc-700">{title}</h4>
      </div>
      {children}
    </div>
  )
}
