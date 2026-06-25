import FormRow from '@components/FormRow'
import Input from '@components/Input'
import DatePickerComponent from '@ui/DatePickerComponent'
import MonitoreoSelectField from '@features/patients/nutricion/forms/MonitoreoSelectField'
import {
  TIPO_AF_OPTIONS,
  FRECUENCIA_AF_OPTIONS,
  CLASIF_TIEMPO_AF_OPTIONS,
  TIEMPO_PRACTICA_OPTIONS,
  PENSAMIENTOS_AF_OPTIONS,
} from '@features/patients/nutricion/constants'

export default function ActFisicaFormFields({ control, register, errors, namePrefix = '' }) {
  const n = (field) => (namePrefix ? `${namePrefix}.${field}` : field)

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormRow label="Fecha monitoreo" error={errors?.fecha?.message}>
        <DatePickerComponent
          name={n('fecha')}
          control={control}
          birthdate={false}
          hasError={errors?.fecha?.message}
        />
      </FormRow>
      <MonitoreoSelectField
        name={n('tipo')}
        control={control}
        label="Tipo AF (Respuesta)"
        options={TIPO_AF_OPTIONS}
        error={errors?.tipo?.message}
      />
      <FormRow label="¿Por qué NO? (si aplica)" error={errors?.porque_no?.message}>
        <Input
          {...register(n('porque_no'))}
          type="text"
          placeholder="Motivo"
          variant="outline"
          size="md"
          hasError={errors?.porque_no?.message}
        />
      </FormRow>
      <MonitoreoSelectField
        name={n('frecuencia')}
        control={control}
        label="Frecuencia (días/semana)"
        options={FRECUENCIA_AF_OPTIONS}
        error={errors?.frecuencia?.message}
      />
      <FormRow label="Duración (minutos)" error={errors?.duracion?.message}>
        <Input
          {...register(n('duracion'))}
          type="number"
          placeholder="0"
          variant="outline"
          size="md"
          hasError={errors?.duracion?.message}
        />
      </FormRow>
      <MonitoreoSelectField
        name={n('clasif_tiempo_af')}
        control={control}
        label="Clasif. Tiempo AF"
        options={CLASIF_TIEMPO_AF_OPTIONS}
        error={errors?.clasif_tiempo_af?.message}
      />
      <FormRow label="Intensidad (%)" error={errors?.intensidad?.message}>
        <Input
          {...register(n('intensidad'))}
          type="number"
          placeholder="0"
          variant="outline"
          size="md"
          hasError={errors?.intensidad?.message}
        />
      </FormRow>
      <MonitoreoSelectField
        name={n('tiempo_de_practica')}
        control={control}
        label="Tiempo de práctica"
        options={TIEMPO_PRACTICA_OPTIONS}
        error={errors?.tiempo_de_practica?.message}
      />
      <div className="col-span-2">
        <MonitoreoSelectField
          name={n('pensamientos_con_realizar_AF')}
          control={control}
          label="¿Qué ha pensado respecto a realizar AF?"
          options={PENSAMIENTOS_AF_OPTIONS}
          error={errors?.pensamientos_con_realizar_AF?.message}
        />
      </div>
    </div>
  )
}
