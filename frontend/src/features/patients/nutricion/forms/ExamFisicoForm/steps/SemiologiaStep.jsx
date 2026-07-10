import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import MonitoreoSelectField from '@features/patients/nutricion/forms/MonitoreoSelectField'
import SemiologiaField from '@features/patients/nutricion/forms/ExamFisicoForm/SemiologiaField'
import {
  ANTROPOMETRICO_FIELDS,
  DIAGNOSTICO_FIELDS,
} from '@features/patients/nutricion/forms/ExamFisicoForm/fieldConfig'
import {
  SEMIOLOGIA_SEVERIDAD_OPTIONS,
  RESERVA_MUSCULAR_OPTIONS,
  EDEMA_OPTIONS,
} from '@features/patients/nutricion/constants'

const DIAG_OPTIONS = {
  severidad: SEMIOLOGIA_SEVERIDAD_OPTIONS,
  muscular: RESERVA_MUSCULAR_OPTIONS,
  edema: EDEMA_OPTIONS,
}

export default function SemiologiaStep() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading as="h4" showBar>
          Indicadores Antropométricos / Físicos
        </Heading>
        <p className="text-5 -mt-1 text-zinc-500">
          Evaluación física de indicadores antropométricos y reservas corporales (escala 0-3).
        </p>
        <div className="grid grid-cols-2 gap-x-8 max-sm:grid-cols-1">
          {ANTROPOMETRICO_FIELDS.map((field) => (
            <SemiologiaField
              key={field.name}
              name={field.name}
              label={field.label}
              options={SEMIOLOGIA_SEVERIDAD_OPTIONS}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Diagnóstico de Reservas
        </Heading>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 max-sm:grid-cols-1">
          {DIAGNOSTICO_FIELDS.map((field) => (
            <MonitoreoSelectField
              key={field.name}
              name={`semiologia.${field.name}`}
              control={control}
              label={field.label}
              options={DIAG_OPTIONS[field.type]}
              hint={field.hint}
              placeholder="Seleccionar evaluación"
            />
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Notas Observacionales
        </Heading>
        <FormRow
          htmlFor="descripcion"
          label="Describa los hallazgos observados en el paciente"
          hint="Cabello, cuello, boca, dientes, manos, uñas, piel, alteraciones de olfato y gusto."
        >
          <Input
            {...register('semiologia.descripcion')}
            id="descripcion"
            textarea
            rows={5}
            placeholder="Escribir observaciones clínicas…"
            variant="outline"
            hasError={errors?.semiologia?.descripcion?.message}
          />
        </FormRow>
      </section>
    </div>
  )
}
