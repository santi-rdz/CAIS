import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { HiOutlineTrash, HiOutlineArrowUturnLeft } from 'react-icons/hi2'
import Radio from '@components/Radio'

// Primitivos compartidos por los steps de relaciones one-to-many
// (HistoriaMedicaStep y TratamientoAlternativoStep).

export function RadioSiNo({ name, control, onSelectSi }) {
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

// Borrado con restauración: marca/desmarca la fila en vez de quitarla del form.
export function DeleteButton({ isDeleted = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-center transition-colors duration-150 ${
        isDeleted ? 'text-zinc-400 hover:text-emerald-500' : 'text-zinc-300 hover:text-red-400'
      }`}
      aria-label={isDeleted ? 'Restaurar fila' : 'Eliminar fila'}
    >
      {isDeleted ? <HiOutlineArrowUturnLeft size={15} /> : <HiOutlineTrash size={15} />}
    </button>
  )
}

export function EmptyRows({ label }) {
  return (
    <p className="text-6 py-4 text-center text-zinc-400">
      Sin {label}. Presiona &ldquo;Agregar&rdquo; para añadir.
    </p>
  )
}

// Fila de un field array con borrado-con-restauración. Se suscribe SOLO a su
// propio _deleted (no al array completo) para aislar el re-render a esta fila.
// Renderiza las celdas (children) + el botón borrar/restaurar como última celda.
export function DeletableRow({ name, index, cols, children }) {
  const { control, setValue } = useFormContext()
  const isDeleted = useWatch({ control, name: `${name}.${index}._deleted` })

  return (
    <div
      className={`group grid ${cols} items-center gap-2 border-b border-zinc-100 py-2 last:border-0 ${
        isDeleted ? 'opacity-40 [&>*:not(:last-child)]:pointer-events-none' : ''
      }`}
    >
      {children}
      <DeleteButton
        isDeleted={isDeleted}
        onClick={() => setValue(`${name}.${index}._deleted`, !isDeleted, { shouldDirty: true })}
      />
    </div>
  )
}
