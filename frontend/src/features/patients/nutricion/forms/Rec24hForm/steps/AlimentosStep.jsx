import { useFormContext, useWatch } from 'react-hook-form'
import AlimentoField from '@features/patients/nutricion/forms/Rec24hForm/AlimentoField'
import IngestaResumen from '@features/patients/nutricion/forms/Rec24hForm/IngestaResumen'
import { REC24H_NUTRIENTES } from '@features/patients/nutricion/constants'

const OBJETIVO_NAMES = REC24H_NUTRIENTES.map((n) => n.objName)

export default function AlimentosStep({ initialEditIndex = null }) {
  const { control } = useFormContext()
  const comidas = useWatch({ control, name: 'comidas' }) ?? []
  const objetivos = useWatch({ control, name: OBJETIVO_NAMES })

  const objetivosMap = Object.fromEntries(OBJETIVO_NAMES.map((name, i) => [name, objetivos?.[i]]))

  return (
    <div className="space-y-6">
      <AlimentoField initialEditIndex={initialEditIndex} />
      <div className="border-t border-zinc-100 pt-5">
        <IngestaResumen objetivos={objetivosMap} comidas={comidas} />
      </div>
    </div>
  )
}
