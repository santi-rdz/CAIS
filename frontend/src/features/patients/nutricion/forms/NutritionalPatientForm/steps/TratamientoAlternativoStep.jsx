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
import {
  TRATAMIENTO_PRODUCTO_OPTIONS,
  MEJORA_OPTIONS,
} from '@features/patients/nutricion/constants'
import {
  ToggleSiNo,
  DeletableRow,
  EmptyRows,
  FieldCell,
} from '@features/patients/nutricion/forms/NutritionalPatientForm/steps/stepFieldRows'

const TRAT_COLS = 'grid-cols-[minmax(0,2fr)_minmax(0,2fr)_5rem_5rem_1.5rem]'
const TRATAMIENTO_DEFAULT = {
  producto: '',
  cual_producto: '',
  mejora: '',
  dosis: '',
  _deleted: false,
}

export default function TratamientoAlternativoStep() {
  const { register, control, formState } = useFormContext()
  const { errors } = formState

  const presentaTrat = useWatch({ control, name: 'presenta_tratamiento' })

  const { fields: tratFields, append: appendTrat } = useFieldArray({
    control,
    name: 'tratamiento_alt_nutricion',
  })

  return (
    <div className="space-y-4">
      <Heading as="h3" showBar>
        Tratamiento Alternativo
      </Heading>
      <p className="text-6 text-zinc-500">
        Productos o terapias alternativas que utiliza el paciente.
      </p>

      <div className="space-y-2">
        <p className="text-5 font-medium text-zinc-700">¿Utiliza alguno?</p>
        <ToggleSiNo
          name="presenta_tratamiento"
          control={control}
          ariaLabel="¿Utiliza algún tratamiento alternativo?"
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
                <DeletableRow
                  key={field.id}
                  name="tratamiento_alt_nutricion"
                  index={index}
                  cols={TRAT_COLS}
                >
                  <Controller
                    name={`tratamiento_alt_nutricion.${index}.producto`}
                    control={control}
                    render={({ field: f }) => (
                      <FieldCell
                        error={errors?.tratamiento_alt_nutricion?.[index]?.producto?.message}
                      >
                        <Select value={f.value} onValueChange={f.onChange} fullWidth allowCustom>
                          <SelectTrigger
                            size="md"
                            hasError={errors?.tratamiento_alt_nutricion?.[index]?.producto?.message}
                          >
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
                      </FieldCell>
                    )}
                  />
                  <FieldCell
                    error={errors?.tratamiento_alt_nutricion?.[index]?.cual_producto?.message}
                  >
                    <Input
                      {...register(`tratamiento_alt_nutricion.${index}.cual_producto`)}
                      type="text"
                      placeholder="¿Cuál?"
                      variant="outline"
                      size="md"
                      hasError={errors?.tratamiento_alt_nutricion?.[index]?.cual_producto?.message}
                    />
                  </FieldCell>
                  <Controller
                    name={`tratamiento_alt_nutricion.${index}.mejora`}
                    control={control}
                    render={({ field: f }) => (
                      <FieldCell
                        error={errors?.tratamiento_alt_nutricion?.[index]?.mejora?.message}
                      >
                        <Select value={f.value} onValueChange={f.onChange} fullWidth>
                          <SelectTrigger
                            size="md"
                            hasError={errors?.tratamiento_alt_nutricion?.[index]?.mejora?.message}
                          >
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
                      </FieldCell>
                    )}
                  />
                  <FieldCell error={errors?.tratamiento_alt_nutricion?.[index]?.dosis?.message}>
                    <Input
                      {...register(`tratamiento_alt_nutricion.${index}.dosis`)}
                      type="text"
                      placeholder="0-0-0"
                      variant="outline"
                      size="md"
                      hasError={errors?.tratamiento_alt_nutricion?.[index]?.dosis?.message}
                    />
                  </FieldCell>
                </DeletableRow>
              ))}
            </div>
          ) : (
            <EmptyRows label="tratamientos" />
          )}
        </div>
      )}
    </div>
  )
}
