import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2'
import Heading from '@components/Heading'
import Input from '@components/Input'
import Radio from '@components/Radio'
import Button from '@components/Button'
import Divider from '@components/Divider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSearch,
  SelectTrigger,
  SelectValue,
} from '@components/Select'
import {
  ENFERMEDAD_OPTIONS,
  TRATAMIENTO_PRODUCTO_OPTIONS,
  MEJORA_OPTIONS,
} from '@features/patients/nutricion/constants'

// ── Shared constants ──────────────────────────────────────────────────────────

const ENF_COLS = 'grid-cols-[minmax(0,2fr)_5rem_minmax(0,2fr)_5rem_1.5rem]'
const TRAT_COLS = 'grid-cols-[minmax(0,2fr)_minmax(0,2fr)_5rem_5rem_1.5rem]'
const ENFERMEDAD_DEFAULT = { enfermedad: '', evol: '', farmacos: '', dosis: '' }
const TRATAMIENTO_DEFAULT = { producto: '', cual_producto: '', mejora: '', dosis: '' }

// ── Sub-components ────────────────────────────────────────────────────────────

function RadioSiNo({ name, control, onSelectSi }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center gap-5">
          <Radio
            id={`${name}-si`}
            label="Sí"
            checked={field.value === 'si'}
            onChange={() => {
              field.onChange('si')
              onSelectSi?.()
            }}
          />
          <Radio
            id={`${name}-no`}
            label="No"
            checked={field.value === 'no'}
            onChange={() => field.onChange('no')}
          />
        </div>
      )}
    />
  )
}

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center justify-center text-zinc-300 transition-colors duration-150 hover:text-red-400"
      aria-label="Eliminar fila"
    >
      <HiOutlineTrash size={15} />
    </button>
  )
}

function EmptyRows({ label }) {
  return (
    <p className="text-6 py-4 text-center text-zinc-400">
      Sin {label}. Presiona &ldquo;Agregar&rdquo; para añadir.
    </p>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function HistoriaMedicaStep() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  const presenta = useWatch({ control, name: 'presenta_enfermedad' })
  const presentaTrat = useWatch({ control, name: 'presenta_tratamiento' })

  const {
    fields: enfFields,
    append: appendEnf,
    remove: removeEnf,
  } = useFieldArray({ control, name: 'enfermedades' })
  const {
    fields: tratFields,
    append: appendTrat,
    remove: removeTrat,
  } = useFieldArray({ control, name: 'tratamientos' })

  return (
    <div className="space-y-6">
      {/* ══ Historia Médica ══ */}
      <div className="space-y-4">
        <Heading as="h3" showBar>
          Historia Médica
        </Heading>
        <p className="text-6 text-zinc-500">
          Información sobre enfermedades y tratamientos del paciente.
        </p>

        <div className="space-y-2">
          <p className="text-5 font-medium text-zinc-700">¿Presenta alguna enfermedad?</p>
          <RadioSiNo
            name="presenta_enfermedad"
            control={control}
            onSelectSi={() => {
              if (enfFields.length === 0) appendEnf(ENFERMEDAD_DEFAULT)
            }}
          />
        </div>

        {presenta === 'si' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-5 font-medium text-zinc-700">Enfermedades</span>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={() => appendEnf(ENFERMEDAD_DEFAULT)}
              >
                <HiOutlinePlus size={13} strokeWidth={2.5} />
                Agregar
              </Button>
            </div>

            {enfFields.length > 0 ? (
              <div>
                <div className={`text-6 mb-0.5 grid ${ENF_COLS} gap-2 px-1 text-zinc-400`}>
                  <span>Enfermedad</span>
                  <span className="whitespace-nowrap">Evol (años)</span>
                  <span>Fármacos</span>
                  <span className="whitespace-nowrap">Dosis (0-0-0)</span>
                  <span />
                </div>
                {enfFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`group grid ${ENF_COLS} items-center gap-2 border-b border-zinc-100 py-2 last:border-0`}
                  >
                    <Controller
                      name={`enfermedades.${index}.enfermedad`}
                      control={control}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange} fullWidth allowCustom>
                          <SelectTrigger size="md">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent maxHeight={200}>
                            <SelectSearch placeholder="Buscar enfermedad..." />
                            {ENFERMEDAD_OPTIONS.map((op) => (
                              <SelectItem key={op} value={op}>
                                {op}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      {...register(`enfermedades.${index}.evol`)}
                      type="number"
                      min={0}
                      placeholder="0"
                      variant="outline"
                      size="md"
                      hasError={errors?.enfermedades?.[index]?.evol?.message}
                    />
                    <Input
                      {...register(`enfermedades.${index}.farmacos`)}
                      type="text"
                      placeholder="Fármacos"
                      variant="outline"
                      size="md"
                      hasError={errors?.enfermedades?.[index]?.farmacos?.message}
                    />
                    <Input
                      {...register(`enfermedades.${index}.dosis`)}
                      type="text"
                      placeholder="0-0-0"
                      variant="outline"
                      size="md"
                      hasError={errors?.enfermedades?.[index]?.dosis?.message}
                    />
                    <DeleteButton onClick={() => removeEnf(index)} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyRows label="enfermedades" />
            )}
          </div>
        )}
      </div>

      <Divider />

      {/* ══ Tratamiento Alternativo ══ */}
      <div className="space-y-4">
        <Heading as="h3" showBar>
          Tratamiento Alternativo
        </Heading>

        <div className="space-y-2">
          <p className="text-5 font-medium text-zinc-700">¿Utiliza alguno?</p>
          <RadioSiNo
            name="presenta_tratamiento"
            control={control}
            onSelectSi={() => {
              if (tratFields.length === 0) appendTrat(TRATAMIENTO_DEFAULT)
            }}
          />
        </div>

        {presentaTrat === 'si' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-5 font-medium text-zinc-700">Tratamientos</span>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={() => appendTrat(TRATAMIENTO_DEFAULT)}
              >
                <HiOutlinePlus size={13} strokeWidth={2.5} />
                Agregar
              </Button>
            </div>

            {tratFields.length > 0 ? (
              <div>
                <div className={`text-6 mb-0.5 grid ${TRAT_COLS} gap-2 px-1 text-zinc-400`}>
                  <span>Producto</span>
                  <span>¿Cuál?</span>
                  <span>Mejoró</span>
                  <span className="whitespace-nowrap">Dosis (0-0-0)</span>
                  <span />
                </div>
                {tratFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`group grid ${TRAT_COLS} items-center gap-2 border-b border-zinc-100 py-2 last:border-0`}
                  >
                    <Controller
                      name={`tratamientos.${index}.producto`}
                      control={control}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange} fullWidth allowCustom>
                          <SelectTrigger size="md">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent maxHeight={200}>
                            <SelectSearch placeholder="Buscar producto..." />
                            {TRATAMIENTO_PRODUCTO_OPTIONS.map((op) => (
                              <SelectItem key={op} value={op}>
                                {op}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      {...register(`tratamientos.${index}.cual_producto`)}
                      type="text"
                      placeholder="¿Cuál?"
                      variant="outline"
                      size="md"
                      hasError={errors?.tratamientos?.[index]?.cual_producto?.message}
                    />
                    <Controller
                      name={`tratamientos.${index}.mejora`}
                      control={control}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange} fullWidth>
                          <SelectTrigger size="md">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            {MEJORA_OPTIONS.map((op) => (
                              <SelectItem key={op} value={op}>
                                {op}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      {...register(`tratamientos.${index}.dosis`)}
                      type="text"
                      placeholder="0-0-0"
                      variant="outline"
                      size="md"
                      hasError={errors?.tratamientos?.[index]?.dosis?.message}
                    />
                    <DeleteButton onClick={() => removeTrat(index)} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyRows label="tratamientos" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
