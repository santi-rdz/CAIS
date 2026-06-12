import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { HiOutlinePlus } from 'react-icons/hi2'
import Heading from '@components/Heading'
import Input from '@components/Input'
import Button from '@components/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSearch,
  SelectTrigger,
  SelectValue,
} from '@components/Select'
import { ENFERMEDAD_OPTIONS } from '@features/patients/nutricion/constants'
import {
  ToggleSiNo,
  DeletableRow,
  EmptyRows,
} from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/stepFieldRows'

const ENF_COLS = 'grid-cols-[minmax(0,2fr)_5rem_minmax(0,2fr)_5rem_1.5rem]'
const ENFERMEDAD_DEFAULT = { enfermedad: '', evol: '', farmacos: '', dosis: '', _deleted: false }

export default function HistoriaMedicaStep() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  const presenta = useWatch({ control, name: 'presenta_enfermedad' })

  const { fields: enfFields, append: appendEnf } = useFieldArray({
    control,
    name: 'historias_medicas_nutricion',
  })

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar>
        Historia Médica
      </Heading>
      <p className="text-6 text-zinc-500">
        Información sobre enfermedades y padecimientos del paciente.
      </p>

      <div className="space-y-2">
        <p className="text-5 font-medium text-zinc-700">¿Presenta alguna enfermedad?</p>
        <ToggleSiNo
          name="presenta_enfermedad"
          control={control}
          ariaLabel="¿Presenta alguna enfermedad?"
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
                <DeletableRow
                  key={field.id}
                  name="historias_medicas_nutricion"
                  index={index}
                  cols={ENF_COLS}
                >
                  <Controller
                    name={`historias_medicas_nutricion.${index}.enfermedad`}
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
                    {...register(`historias_medicas_nutricion.${index}.evol`)}
                    type="number"
                    min={0}
                    placeholder="0"
                    variant="outline"
                    size="md"
                    hasError={errors?.historias_medicas_nutricion?.[index]?.evol?.message}
                  />
                  <Input
                    {...register(`historias_medicas_nutricion.${index}.farmacos`)}
                    type="text"
                    placeholder="Fármacos"
                    variant="outline"
                    size="md"
                    hasError={errors?.historias_medicas_nutricion?.[index]?.farmacos?.message}
                  />
                  <Input
                    {...register(`historias_medicas_nutricion.${index}.dosis`)}
                    type="text"
                    placeholder="0-0-0"
                    variant="outline"
                    size="md"
                    hasError={errors?.historias_medicas_nutricion?.[index]?.dosis?.message}
                  />
                </DeletableRow>
              ))}
            </div>
          ) : (
            <EmptyRows label="enfermedades" />
          )}
        </div>
      )}
    </div>
  )
}
