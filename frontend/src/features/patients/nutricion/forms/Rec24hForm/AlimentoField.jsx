import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheck, HiXMark } from 'react-icons/hi2'
import Button from '@components/Button'
import Input from '@components/Input'
import FormRow from '@components/FormRow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import {
  REC24H_NUTRIENTES,
  TIEMPO_COMIDA_OPTIONS,
  SMAE_GRUPO_OPTIONS,
  SMAE_GRUPO_MAP,
  SMAE_AUTOFILL_KEYS,
} from '@features/patients/nutricion/constants'

const emptyPending = () => ({
  comida: '',
  grupo: '',
  alimento: '',
  ...Object.fromEntries(REC24H_NUTRIENTES.map((n) => [n.key, ''])),
})

// Captura de alimentos: un formulario plano (sin recuadro) que agrega a la lista
// `comidas`. Al elegir un grupo del SMAE se autocompletan los 4 macros que la
// tabla modela (editables). Cada alimento hereda la fecha_eval del recordatorio.
// Tocar un alimento de la lista lo carga aquí para editarlo.
export default function AlimentoField({ initialEditIndex = null }) {
  const { control, getValues } = useFormContext()
  const [editingIndex, setEditingIndex] = useState(initialEditIndex)
  const [pending, setPending] = useState(() => {
    if (initialEditIndex == null) return emptyPending()
    const c = getValues('comidas')?.[initialEditIndex]
    return c ? { ...emptyPending(), ...c } : emptyPending()
  })
  const isEditing = editingIndex != null

  const setField = (key, value) => setPending((p) => ({ ...p, [key]: value }))

  function selectGrupo(grupo) {
    const macros = SMAE_GRUPO_MAP[grupo]
    setPending((p) => ({
      ...p,
      grupo,
      ...(macros ? Object.fromEntries(SMAE_AUTOFILL_KEYS.map((k) => [k, String(macros[k])])) : {}),
    }))
  }

  function reset() {
    setPending(emptyPending())
    setEditingIndex(null)
  }

  return (
    <Controller
      name="comidas"
      control={control}
      render={({ field }) => {
        const lista = field.value ?? []

        function save() {
          const nombre = pending.alimento.trim()
          if (!nombre) return
          const item = { ...pending, alimento: nombre }
          if (isEditing) {
            field.onChange(lista.map((c, i) => (i === editingIndex ? item : c)))
          } else {
            field.onChange([...lista, item])
          }
          reset()
        }

        function startEdit(idx) {
          setPending({ ...emptyPending(), ...lista[idx] })
          setEditingIndex(idx)
        }

        function removeAt(idx) {
          field.onChange(lista.filter((_, i) => i !== idx))
          if (editingIndex === idx) {
            reset()
          } else if (editingIndex != null && idx < editingIndex) {
            // La lista se recorre: mantén el índice apuntando al mismo alimento.
            setEditingIndex((cur) => cur - 1)
          }
        }

        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <p className="text-4 font-semibold text-zinc-800">
                  {isEditing ? `Editando alimento #${editingIndex + 1}` : 'Agregar alimento'}
                </p>
                {isEditing && (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-6 flex cursor-pointer items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-700"
                  >
                    <HiXMark size={13} />
                    Cancelar edición
                  </button>
                )}
              </div>

              <FormRow htmlFor="alimento-nombre" label="Nombre / descripción del alimento">
                <Input
                  id="alimento-nombre"
                  type="text"
                  value={pending.alimento}
                  onChange={(e) => setField('alimento', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      save()
                    }
                  }}
                  placeholder="Ej: Manzana roja mediana, arroz blanco cocido…"
                  variant="outline"
                  size="md"
                />
              </FormRow>

              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <FormRow label="Tiempo de comida">
                  <Select
                    value={pending.comida}
                    onValueChange={(v) => setField('comida', v)}
                    fullWidth
                  >
                    <SelectTrigger size="md">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIEMPO_COMIDA_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormRow>

                <FormRow label="Grupo alimenticio (SMAE)">
                  <Select value={pending.grupo} onValueChange={selectGrupo} fullWidth>
                    <SelectTrigger size="md">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {SMAE_GRUPO_OPTIONS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormRow>
              </div>

              <div className="space-y-2">
                <p className="text-6 font-medium tracking-wide text-zinc-400 uppercase">
                  Aporte por porción
                </p>
                <div className="grid grid-cols-4 gap-2.5 max-sm:grid-cols-2">
                  {REC24H_NUTRIENTES.map(({ key, label, unit }) => (
                    <label key={key} className="block">
                      <span className="text-6 mb-1 block text-zinc-500">
                        {label} <span className="text-zinc-400">({unit})</span>
                      </span>
                      <Input
                        id={`al-${key}`}
                        type="number"
                        step="0.1"
                        min="0"
                        value={pending[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        placeholder="0"
                        variant="outline"
                        size="sm"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {isEditing && (
                  <Button type="button" variant="ghost" size="md" onClick={reset}>
                    Cancelar
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="gap-1.5"
                  onClick={save}
                  disabled={!pending.alimento.trim()}
                >
                  {isEditing ? (
                    <HiOutlineCheck size={15} />
                  ) : (
                    <HiOutlinePlus size={14} strokeWidth={2.5} />
                  )}
                  {isEditing ? 'Guardar cambios' : 'Agregar alimento'}
                </Button>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-zinc-100 pt-5">
              <p className="text-4 font-semibold text-zinc-800">
                Alimentos registrados
                {lista.length > 0 && (
                  <span className="text-5 ml-1.5 font-normal text-zinc-400">({lista.length})</span>
                )}
              </p>

              {lista.length === 0 ? (
                <p className="text-5 text-zinc-400">
                  Aún no hay alimentos. Agrega el primero arriba.
                </p>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  {lista.map((c, idx) => {
                    const active = editingIndex === idx
                    return (
                      <li
                        key={`${c.alimento}-${idx}`}
                        onClick={() => startEdit(idx)}
                        onKeyDown={(e) => {
                          if (e.target !== e.currentTarget) return
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            startEdit(idx)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Editar ${c.alimento}`}
                        className={`group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors ${
                          active ? 'bg-teal-50' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <span
                          className={`text-6 flex size-6 shrink-0 items-center justify-center rounded-full font-semibold ${
                            active ? 'bg-teal-600 text-white' : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-5 truncate font-medium text-zinc-800">{c.alimento}</p>
                          <p className="text-6 truncate text-zinc-400">
                            {[c.comida, c.grupo].filter(Boolean).join(' • ') || 'Sin clasificar'}
                          </p>
                        </div>
                        {c.calorias !== '' && c.calorias != null && (
                          <span className="text-6 shrink-0 text-zinc-400">{c.calorias} kcal</span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeAt(idx)
                          }}
                          aria-label={`Quitar ${c.alimento}`}
                          className="shrink-0 cursor-pointer rounded-md p-1.5 text-zinc-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 focus-visible:text-red-600 focus-visible:opacity-100"
                        >
                          <HiOutlineTrash size={15} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )
      }}
    />
  )
}
