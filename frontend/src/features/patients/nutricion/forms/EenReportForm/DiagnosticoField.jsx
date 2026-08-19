import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheck, HiXMark } from 'react-icons/hi2'
import Button from '@components/Button'
import Input from '@components/Input'
import FormRow from '@components/FormRow'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/Select'
import {
  EEN_PES_OPTIONS,
  EEN_INTERVENCION_OPTIONS,
  EEN_PROGRESO_OPTIONS,
} from '@features/patients/nutricion/constants'
import {
  MAX_DIAGNOSTICOS,
  emptyDiagnostico,
} from '@features/patients/nutricion/forms/EenReportForm/fieldConfig'

function DiagnosticoSelect({ label, placeholder, value, options, onChange }) {
  return (
    <FormRow label={label}>
      <Select value={value} onValueChange={onChange} fullWidth>
        <SelectTrigger size="md">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormRow>
  )
}

function DiagnosticoText({ name, label, placeholder, value, onChange }) {
  return (
    <FormRow htmlFor={`${name}-diag`} label={label}>
      <Input
        id={`${name}-diag`}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outline"
        size="md"
      />
    </FormRow>
  )
}

// Captura de diagnósticos PES: un formulario plano que agrega a la lista
// `diagnosticos`, con la lista de registrados abajo (mismo patrón que el
// recordatorio de 24h). Tocar un diagnóstico lo carga aquí para editarlo.
export default function DiagnosticoField({ initialEditIndex = null }) {
  const { control, getValues } = useFormContext()
  const [editingIndex, setEditingIndex] = useState(initialEditIndex)
  const [pending, setPending] = useState(() => {
    if (initialEditIndex == null) return emptyDiagnostico()
    const d = getValues('diagnosticos')?.[initialEditIndex]
    return d ? { ...emptyDiagnostico(), ...d } : emptyDiagnostico()
  })
  const isEditing = editingIndex != null

  const setField = (key, value) => setPending((p) => ({ ...p, [key]: value }))

  function reset() {
    setPending(emptyDiagnostico())
    setEditingIndex(null)
  }

  return (
    <Controller
      name="diagnosticos"
      control={control}
      render={({ field }) => {
        const lista = field.value ?? []
        const canAdd = lista.length < MAX_DIAGNOSTICOS || isEditing

        function save() {
          if (!pending.pes.trim()) return
          const item = { ...pending, pes: pending.pes.trim() }
          if (isEditing) {
            field.onChange(lista.map((d, i) => (i === editingIndex ? item : d)))
          } else {
            field.onChange([...lista, item])
          }
          reset()
        }

        function startEdit(idx) {
          setPending({ ...emptyDiagnostico(), ...lista[idx] })
          setEditingIndex(idx)
        }

        function removeAt(idx) {
          field.onChange(lista.filter((_, i) => i !== idx))
          if (editingIndex === idx) {
            reset()
          } else if (editingIndex != null && idx < editingIndex) {
            setEditingIndex((cur) => cur - 1)
          }
        }

        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <p className="text-4 font-semibold text-zinc-800">
                  {isEditing ? `Editando diagnóstico #${editingIndex + 1}` : 'Agregar diagnóstico'}
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

              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <DiagnosticoSelect
                  label="Diagnóstico (PES)"
                  placeholder="Seleccionar PES"
                  value={pending.pes}
                  options={EEN_PES_OPTIONS}
                  onChange={(v) => setField('pes', v)}
                />
                <DiagnosticoSelect
                  label="Intervención"
                  placeholder="Seleccionar"
                  value={pending.intervencion}
                  options={EEN_INTERVENCION_OPTIONS}
                  onChange={(v) => setField('intervencion', v)}
                />
              </div>

              <DiagnosticoText
                name="objetivos"
                label="Objetivo"
                placeholder="Objetivo del tratamiento nutricional"
                value={pending.objetivos}
                onChange={(e) => setField('objetivos', e.target.value)}
              />

              <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
                <DiagnosticoText
                  name="indicadores"
                  label="Indicadores"
                  placeholder="Indicadores"
                  value={pending.indicadores}
                  onChange={(e) => setField('indicadores', e.target.value)}
                />
                <DiagnosticoText
                  name="criterio"
                  label="Criterio"
                  placeholder="Criterio"
                  value={pending.criterio}
                  onChange={(e) => setField('criterio', e.target.value)}
                />
                <DiagnosticoSelect
                  label="Progreso diagnóstico"
                  placeholder="Estado"
                  value={pending.progreso}
                  options={EEN_PROGRESO_OPTIONS}
                  onChange={(v) => setField('progreso', v)}
                />
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
                  disabled={!pending.pes.trim() || !canAdd}
                >
                  {isEditing ? (
                    <HiOutlineCheck size={15} />
                  ) : (
                    <HiOutlinePlus size={14} strokeWidth={2.5} />
                  )}
                  {isEditing ? 'Guardar cambios' : 'Agregar diagnóstico'}
                </Button>
              </div>
            </div>

            <div className="space-y-2.5 border-t border-zinc-100 pt-5">
              <p className="text-4 font-semibold text-zinc-800">
                Diagnósticos registrados
                {lista.length > 0 && (
                  <span className="text-5 ml-1.5 font-normal text-zinc-400">({lista.length})</span>
                )}
              </p>

              {lista.length === 0 ? (
                <p className="text-5 text-zinc-400">
                  Aún no hay diagnósticos. Agrega el primero arriba.
                </p>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  {lista.map((d, idx) => {
                    const active = editingIndex === idx
                    return (
                      <li
                        key={`${d.pes}-${idx}`}
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
                        aria-label="Editar diagnóstico"
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
                          <p className="text-5 truncate font-medium text-zinc-800">
                            {d.pes || 'Sin diagnóstico'}
                          </p>
                          <p className="text-6 truncate text-zinc-400">
                            {[d.intervencion, d.progreso].filter(Boolean).join(' • ') ||
                              'Sin intervención'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeAt(idx)
                          }}
                          aria-label="Quitar diagnóstico"
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
