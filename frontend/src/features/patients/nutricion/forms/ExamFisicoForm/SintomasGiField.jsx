import { Controller, useFormContext } from 'react-hook-form'
import { HiXMark } from 'react-icons/hi2'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSearch,
  SelectTrigger,
  SelectValue,
} from '@components/Select'
import { SGI_SINTOMAS_OPTIONS } from '@features/patients/nutricion/constants'

// Un solo select que construye la lista de síntomas GI al hacer clic (en vez de
// renderizar N selects fijos). Los ya agregados se retiran del catálogo y se
// muestran como chips removibles. Escribe el auxiliar `sintomas` (string[]).
export default function SintomasGiField() {
  const { control } = useFormContext()

  return (
    <Controller
      name="sintomas"
      control={control}
      render={({ field }) => {
        const lista = field.value ?? []
        const available = SGI_SINTOMAS_OPTIONS.filter((s) => !lista.includes(s))

        function add(sintoma) {
          if (!sintoma || lista.includes(sintoma)) return
          field.onChange([...lista, sintoma])
        }

        return (
          <div className="space-y-3">
            <Select value="" onValueChange={add} clearable={false} fullWidth>
              <SelectTrigger size="md">
                <SelectValue placeholder="Seleccionar síntoma" />
              </SelectTrigger>
              <SelectContent maxHeight={200}>
                <SelectSearch placeholder="Buscar síntoma..." />
                {available.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {lista.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {lista.map((s) => (
                  <span
                    key={s}
                    className="text-5 flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 py-1 pr-1.5 pl-2.5 font-medium text-teal-700"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => field.onChange(lista.filter((x) => x !== s))}
                      aria-label={`Quitar ${s}`}
                      className="cursor-pointer rounded-md p-0.5 text-teal-500 transition-colors hover:bg-teal-100 hover:text-teal-800"
                    >
                      <HiXMark size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-6 text-zinc-400">Aún no se han agregado síntomas.</p>
            )}
          </div>
        )
      }}
    />
  )
}
