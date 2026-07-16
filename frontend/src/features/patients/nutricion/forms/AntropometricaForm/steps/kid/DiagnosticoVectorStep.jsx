import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import {
  NumberField,
  SelectField,
  AutoField,
} from '@features/patients/nutricion/forms/AntropometricaForm/AntroFields'
import { computeVector } from '@features/patients/nutricion/forms/AntropometricaForm/serialize'
import {
  NOM031_OPTIONS,
  DIAGNOSTICO_INTEGRAL_OPTIONS,
  ANTRO_HINTS,
} from '@features/patients/nutricion/constants'

export default function DiagnosticoVectorStep() {
  const { control } = useFormContext()
  const [resistencia, reactancia] = useWatch({
    control,
    name: ['kid.resistencia', 'kid.reactancia'],
  })
  const { angulo_fase, tan_angulo_fase } = computeVector(resistencia, reactancia)

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <Heading as="h4" showBar>
          Peso para la edad
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="kid.peso_para_edad" label="Valor peso/edad" />
          <NumberField
            name="kid.desviacion_estandar_peso_edad"
            label="Desviación estándar"
            placeholder="Z-score"
          />
          <SelectField
            name="kid.interpretacion_nom_peso_edad"
            label="Interpretación NOM-031"
            options={NOM031_OPTIONS}
          />
        </div>
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Diagnóstico antropométrico general
        </Heading>
        <SelectField
          name="kid.diagnostico_general"
          label="Diagnóstico integral"
          placeholder="Seleccionar diagnóstico"
          options={DIAGNOSTICO_INTEGRAL_OPTIONS}
        />
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Análisis vectorial (opcional)
        </Heading>
        <p className="text-6 -mt-3 text-zinc-400">
          Bioimpedancia eléctrica para evaluación de composición corporal.
        </p>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="kid.resistencia" label="Resistencia" unit="Ω" />
          <NumberField name="kid.reactancia" label="Reactancia" unit="Ω" />
          <AutoField
            label="Ángulo de fase"
            unit="°"
            value={angulo_fase}
            tooltip={ANTRO_HINTS.angulo_fase}
          />
          <AutoField label="Tangente del ángulo" value={tan_angulo_fase} />
        </div>
      </section>
    </div>
  )
}
