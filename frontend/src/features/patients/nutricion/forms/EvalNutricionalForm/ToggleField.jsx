import { Controller } from 'react-hook-form'
import SegmentedToggle from '@components/SegmentedToggle'

const toOpt = (v) => (v === true ? 'si' : v === false ? 'no' : '')
const fromOpt = (v) => (v === 'si' ? true : v === 'no' ? false : null)

// Campo de opción binaria como control segmentado (en vez de un dropdown más).
// `boolean` (default) mapea true/false ↔ 'si'/'no'; con `boolean={false}` guarda
// el string de la opción tal cual (ej. Oral/Sonda). Layout label→toggle en línea.
export default function ToggleField({ name, control, label, options, boolean = true }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: f }) => (
        <div className="flex items-center justify-between gap-4 py-1.5">
          <span className="text-5 text-zinc-600">{label}</span>
          <SegmentedToggle
            value={boolean ? toOpt(f.value) : (f.value ?? '')}
            onChange={(v) => f.onChange(boolean ? fromOpt(v) : v)}
            options={options}
            ariaLabel={label}
          />
        </div>
      )}
    />
  )
}
