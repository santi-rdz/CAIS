import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { HiOutlinePlus, HiXMark } from 'react-icons/hi2'
import Button from '@components/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import { SGI_SINTOMAS_OPTIONS } from '@features/patients/nutricion/constants'

// Un solo select + botón "Agregar" que construye la lista de síntomas GI (en vez
// de renderizar N selects fijos). Los ya agregados se retiran del catálogo y se
// muestran como chips removibles. Escribe el auxiliar `sintomas` (string[]).
export default function SintomasGiField() {
  const { control } = useFormContext()
  const [pending, setPending] = useState('')

  return (
    <Controller
      name="sintomas"
      control={control}
      render={({ field }) => {
        const lista = field.value ?? []
        const available = SGI_SINTOMAS_OPTIONS.filter((s) => !lista.includes(s))

        function add() {
          if (!pending || lista.includes(pending)) return
          field.onChange([...lista, pending])
          setPending('')
        }

        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <Select value={pending} onValueChange={setPending} clearable={false} fullWidth>
                  <SelectTrigger size="md">
                    <SelectValue placeholder="Seleccionar síntoma" />
                  </SelectTrigger>
                  <SelectContent>
                    {available.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="shrink-0 gap-1.5"
                onClick={add}
                disabled={!pending}
              >
                <HiOutlinePlus size={14} strokeWidth={2.5} />
                Agregar síntoma
              </Button>
            </div>

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
