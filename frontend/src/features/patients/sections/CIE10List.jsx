export default function CIE10List({ codes }) {
  return (
    <div className="space-y-2">
      <p className="text-6 font-semibold tracking-widest text-zinc-400 uppercase">
        Diagnóstico CIE-10
      </p>
      {!codes?.length ? (
        <p className="text-5 text-zinc-300">—</p>
      ) : (
      <div className="flex flex-wrap gap-2">
        {codes.map(({ codigo, descripcion }) => (
          <div
            key={codigo}
            className="inline-flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5"
          >
            <span className="text-5 shrink-0 font-bold text-blue-700">
              {codigo}
            </span>
            {descripcion && (
              <>
                <div className="h-4 w-px shrink-0 bg-blue-200" />
                <span className="text-5 text-blue-600">{descripcion}</span>
              </>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
