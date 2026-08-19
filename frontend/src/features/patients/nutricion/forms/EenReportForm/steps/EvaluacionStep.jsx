import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import Grid from '@components/Grid'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import MonitoreoSelectField from '@features/patients/nutricion/forms/MonitoreoSelectField'
import { formatNumber } from '@lib/utils'
import {
  EEN_APETITO_OPTIONS,
  IMC_OMS_HINT,
  computeIMC,
  classifyIMC,
} from '@features/patients/nutricion/constants'
import {
  ANTROPOMETRIA_FIELDS,
  ADULTO_OBS_FIELDS,
  KID_OBS_FIELDS,
  SOLICITO_ORIENT_OPTIONS,
} from '@features/patients/nutricion/forms/EenReportForm/fieldConfig'

function ObservacionField({ name, label, placeholder, register, errors }) {
  return (
    <FormRow htmlFor={name} label={label}>
      <Input
        {...register(name)}
        id={name}
        textarea
        rows={3}
        placeholder={placeholder}
        variant="outline"
        size="md"
        hasError={errors?.[name]?.message}
      />
    </FormRow>
  )
}

export default function EvaluacionStep({ esAdulto }) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const imc = computeIMC({ peso: watch('peso'), estatura: watch('estatura') })
  // Los rangos OMS del IMC son de adulto; en pediátricos se muestra el valor sin
  // clasificar (requiere percentiles por edad/sexo, aún no disponibles).
  const clasif = esAdulto ? classifyIMC(imc) : null
  const imcDisplay = imc == null ? '' : `${formatNumber(imc)}${clasif ? ` · ${clasif.label}` : ''}`

  const numberRow = (f) => (
    <FormRow key={f.name} htmlFor={f.name} label={f.label}>
      <Input
        {...register(f.name)}
        id={f.name}
        type="number"
        step={f.step}
        min="0"
        placeholder={f.placeholder}
        variant="outline"
        size="md"
        hasError={errors?.[f.name]?.message}
      />
    </FormRow>
  )

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <Heading as="h4" showBar>
          Información general
        </Heading>
        <FormRow label="Fecha de evaluación" error={errors?.fecha_eval?.message}>
          <DatePickerComponent
            name="fecha_eval"
            control={control}
            birthdate={false}
            hasError={errors?.fecha_eval?.message}
          />
        </FormRow>
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Evaluación nutricional
        </Heading>
        <Grid cols={2} gap={4} mobileCols={1}>
          {ANTROPOMETRIA_FIELDS.slice(0, 2).map(numberRow)}
        </Grid>
        <Grid cols={3} gap={4} mobileCols={1}>
          <MonitoreoSelectField
            name="apetito"
            control={control}
            label="Apetito"
            options={EEN_APETITO_OPTIONS}
            error={errors?.apetito?.message}
          />
          {numberRow(ANTROPOMETRIA_FIELDS[2])}
          <FormRow
            label="IMC (kg/m²)"
            tooltip="Se calcula automáticamente con el peso y la estatura (kg/m²)."
          >
            <Input
              value={imcDisplay}
              placeholder="Auto"
              variant="outline"
              size="md"
              disabled
              readOnly
            />
          </FormRow>
        </Grid>
        {esAdulto && (
          <p className="text-6 rounded-lg bg-zinc-50 px-3 py-2 text-zinc-500">{IMC_OMS_HINT}</p>
        )}
      </section>

      <section className="space-y-3 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Observaciones
        </Heading>
        {esAdulto ? (
          ADULTO_OBS_FIELDS.map((f) => (
            <ObservacionField key={f.name} {...f} register={register} errors={errors} />
          ))
        ) : (
          <>
            <MonitoreoSelectField
              name="solicito_orient"
              control={control}
              label="¿Se solicitó orientación nutricional?"
              options={SOLICITO_ORIENT_OPTIONS}
              error={errors?.solicito_orient?.message}
            />
            {KID_OBS_FIELDS.map((f) => (
              <ObservacionField key={f.name} {...f} register={register} errors={errors} />
            ))}
          </>
        )}
      </section>
    </div>
  )
}
