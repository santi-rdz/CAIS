import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import {
  NumberField,
  AutoField,
  AutoSelectField,
} from '@features/patients/nutricion/forms/AntropometricaForm/AntroFields'
import { computeImcAdulto } from '@features/patients/nutricion/forms/AntropometricaForm/serialize'
import {
  DIAGNOSTICO_IMC_OPTIONS,
  suggestDiagnosticoImc,
  ANTRO_HINTS,
} from '@features/patients/nutricion/constants'

export default function ImcPliieguesStep() {
  const { control } = useFormContext()
  const [estatura, pesoActual, edemaLiq] = useWatch({
    control,
    name: ['estatura', 'peso_actual', 'adulto.edema_liq'],
  })
  const imc = computeImcAdulto(pesoActual, edemaLiq, estatura)

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <Heading as="h4" showBar>
          Índice de masa corporal (IMC)
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <AutoField label="IMC" unit="kg/m²" value={imc} tooltip={ANTRO_HINTS.imc} />
          <AutoSelectField
            name="adulto.diagnostico_imc"
            label="Diagnóstico IMC"
            options={DIAGNOSTICO_IMC_OPTIONS}
            suggested={suggestDiagnosticoImc(imc)}
          />
        </div>
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Circunferencias y pliegues cutáneos
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="pb" label="Circunferencia media de brazo / PB" unit="cm" />
          <NumberField name="adulto.pcb" label="Pliegue cutáneo bicipital / PCB" unit="mm" />
          <NumberField name="pct" label="Pliegue cutáneo tricipital / PCT" unit="mm" />
          <NumberField name="pcse" label="Pliegue cutáneo subescapular / PCSE" unit="mm" />
          <NumberField name="adulto.pcsi" label="Pliegue cutáneo suprailiaco / PCSI" unit="mm" />
          <NumberField name="pantorrilla" label="Circunferencia de pantorrilla" unit="cm" />
        </div>
      </section>
    </div>
  )
}
