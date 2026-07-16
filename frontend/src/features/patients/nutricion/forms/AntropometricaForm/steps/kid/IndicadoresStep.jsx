import Heading from '@components/Heading'
import {
  NumberField,
  SelectField,
} from '@features/patients/nutricion/forms/AntropometricaForm/AntroFields'
import { NOM031_OPTIONS } from '@features/patients/nutricion/constants'

export default function IndicadoresStep() {
  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <Heading as="h4" showBar>
          Peso para la talla
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="kid.peso_para_talla" label="Valor peso/talla" />
          <NumberField name="kid.peso_ideal" label="Identificación de peso ideal" unit="kg" />
          <NumberField
            name="kid.desviacion_estandar_peso"
            label="Desviación estándar"
            placeholder="Z-score"
          />
          <SelectField
            name="kid.interpretacion_nom_peso"
            label="Interpretación NOM-031"
            options={NOM031_OPTIONS}
          />
        </div>
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Talla para la edad
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="kid.talla_para_edad" label="Valor talla/edad" />
          <NumberField name="kid.talla_ideal" label="Identificación de talla ideal" unit="cm" />
          <NumberField
            name="kid.desviacion_estandar_talla"
            label="Desviación estándar"
            placeholder="Z-score"
          />
          <SelectField
            name="kid.interpretacion_nom_talla"
            label="Interpretación NOM-031"
            options={NOM031_OPTIONS}
          />
        </div>
      </section>
    </div>
  )
}
