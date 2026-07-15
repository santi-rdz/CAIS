import { useFormContext, useWatch } from 'react-hook-form'
import Heading from '@components/Heading'
import {
  NumberField,
  AutoField,
  AutoSelectField,
} from '@features/patients/nutricion/forms/AntropometricaForm/AntroFields'
import { computeIcc } from '@features/patients/nutricion/forms/AntropometricaForm/serialize'
import {
  diagnosticoIccOptions,
  RIESGO_OPTIONS,
  suggestRiesgoCintura,
  suggestRiesgoCuello,
  suggestDiagnosticoIcc,
  ANTRO_HINTS,
} from '@features/patients/nutricion/constants'

function Reference({ children }) {
  return (
    <p className="text-6 rounded-lg bg-sky-50 px-3 py-2 text-sky-800">
      <span className="font-semibold">Referencia:</span> {children}
    </p>
  )
}

export default function RiesgoCvStep({ femenino }) {
  const { control } = useFormContext()
  const [cintura, cadera, cuello] = useWatch({
    control,
    name: ['cintura', 'adulto.cadera', 'adulto.circuf_cuello'],
  })
  const icc = computeIcc(cintura, cadera)
  const sexo = femenino ? '♀' : '♂'

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <Heading as="h4" showBar>
          Riesgo cardiovascular
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="cintura" label="Circunferencia de cintura" unit="cm" />
          <AutoSelectField
            name="adulto.riesgo_cv"
            label="Indicador de riesgo"
            options={RIESGO_OPTIONS}
            suggested={suggestRiesgoCintura(cintura, femenino)}
            tooltip={ANTRO_HINTS.riesgo_cv}
          />
          <NumberField name="adulto.cadera" label="Circunferencia de cadera" unit="cm" />
          <AutoField
            label="Índice cintura-cadera"
            value={icc}
            tooltip={ANTRO_HINTS.indice_cintura_cadera}
          />
        </div>
        <AutoSelectField
          name="adulto.diagnostico_icc"
          label="Diagnóstico ICC"
          options={diagnosticoIccOptions(femenino)}
          suggested={suggestDiagnosticoIcc(icc, femenino)}
        />
        <Reference>
          Cintura {sexo} &gt;{femenino ? 80 : 94} cm · ICC {sexo} &gt;{femenino ? 0.84 : 0.94}
        </Reference>
      </section>

      <section className="space-y-5 border-t border-zinc-100 pt-5">
        <Heading as="h4" showBar>
          Indicadores adicionales de riesgo
        </Heading>
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <NumberField name="adulto.circuf_cuello" label="Circunferencia de cuello" unit="cm" />
          <AutoSelectField
            name="adulto.riesgo_eo_inf"
            label="Indicador de riesgo"
            options={RIESGO_OPTIONS}
            suggested={suggestRiesgoCuello(cuello, femenino)}
            tooltip={ANTRO_HINTS.riesgo_eo_inf}
          />
        </div>
        <Reference>
          Cuello {sexo} &gt;{femenino ? 34 : 37} cm
        </Reference>
      </section>
    </div>
  )
}
