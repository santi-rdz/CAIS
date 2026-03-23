import { useState } from 'react'
import Heading from '@components/Heading'
import Tab from '@components/Tab'
import {
  PERIODOS,
  buildAntPatFields,
  buildAntFamFields,
  buildAparSistFields,
} from './historia/constants'
import { HISTORIAS } from './historia/mockData'
import HistoriaPeriodSelect from './historia/components/HistoriaPeriodSelect'
import FieldsSection from './historia/sections/FieldsSection'
import SignosVitalesSection from './historia/sections/SignosVitalesSection'
import NoPatologicosSection from './historia/sections/NoPatologicosSection'
import ConsultaYPlanSection from './historia/sections/ConsultaYPlanSection'

export default function PatientHistoria() {
  const [periodo, setPeriodo] = useState('2026-2031')
  const historia = HISTORIAS[periodo] ?? null

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <Heading as="h3">Historia médica</Heading>
        <HistoriaPeriodSelect
          value={periodo}
          onChange={setPeriodo}
          periodos={PERIODOS}
        />
      </div>

      <Tab variant="underline" defaultTab="heredofamiliares">
        <Tab.List>
          <Tab.Trigger value="heredofamiliares">Heredofamiliares</Tab.Trigger>
          <Tab.Trigger value="no-patologicos">No Patológicos</Tab.Trigger>
          <Tab.Trigger value="patologicos">Patológicos</Tab.Trigger>
          <Tab.Trigger value="aparatos">Aparatos y sistemas</Tab.Trigger>
          <Tab.Trigger value="exploracion">Exploración física</Tab.Trigger>
          <Tab.Trigger value="consulta-plan">Consulta y Plan</Tab.Trigger>
        </Tab.List>

        <div className="p-5">
          {!historia ? (
            <p className="text-5 py-8 text-center text-zinc-400">
              Sin historia médica registrada para este periodo.
            </p>
          ) : (
            <>
              <Tab.Panel value="heredofamiliares" scrollable={false}>
                <FieldsSection
                  fields={buildAntFamFields(historia.antecedentes_familiares)}
                />
              </Tab.Panel>
              <Tab.Panel value="no-patologicos" scrollable={false}>
                <NoPatologicosSection historia={historia} />
              </Tab.Panel>
              <Tab.Panel value="patologicos" scrollable={false}>
                <FieldsSection
                  fields={buildAntPatFields(historia.antecedentes_patologicos)}
                  cols={3}
                />
              </Tab.Panel>
              <Tab.Panel value="aparatos" scrollable={false}>
                <FieldsSection
                  fields={buildAparSistFields(historia.aparatos_sistemas)}
                  cols={3}
                />
              </Tab.Panel>
              <Tab.Panel value="exploracion" scrollable={false}>
                <SignosVitalesSection info={historia.informacion_fisica} />
              </Tab.Panel>
              <Tab.Panel value="consulta-plan" scrollable={false}>
                <ConsultaYPlanSection historia={historia} />
              </Tab.Panel>
            </>
          )}
        </div>
      </Tab>
    </div>
  )
}
