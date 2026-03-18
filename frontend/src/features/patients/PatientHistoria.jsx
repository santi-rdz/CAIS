import { useState } from 'react'
import Heading from '@components/Heading'
import Tab from '@components/Tab'
import { PERIODOS, buildAntPatFields, buildAntFamFields, buildAparSistFields } from './historia/constants'
import { HISTORIAS } from './historia/mockData'
import HistoriaPeriodSelect from './historia/components/HistoriaPeriodSelect'
import ConsultaSection from './historia/sections/ConsultaSection'
import SignosVitalesSection from './historia/sections/SignosVitalesSection'
import FieldsSection from './historia/sections/FieldsSection'
import InmunizacionesSection from './historia/sections/InmunizacionesSection'
import PlanEstudioSection from './historia/sections/PlanEstudioSection'
import ServiciosSection from './historia/sections/ServiciosSection'

export default function PatientHistoria() {
  const [periodo, setPeriodo] = useState('2026-2031')
  const historia = HISTORIAS[periodo] ?? null

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <Heading as="h3">Historia médica</Heading>
        <HistoriaPeriodSelect value={periodo} onChange={setPeriodo} periodos={PERIODOS} />
      </div>

      <Tab variant="underline" defaultTab="consulta">
        <Tab.List>
          <Tab.Trigger value="consulta">Consulta</Tab.Trigger>
          <Tab.Trigger value="signos">Signos vitales</Tab.Trigger>
          <Tab.Trigger value="ant-patologicos">Ant. patológicos</Tab.Trigger>
          <Tab.Trigger value="ant-familiares">Ant. familiares</Tab.Trigger>
          <Tab.Trigger value="aparatos">Aparatos y sistemas</Tab.Trigger>
          <Tab.Trigger value="inmunizaciones">Inmunizaciones</Tab.Trigger>
          <Tab.Trigger value="plan">Plan de estudio</Tab.Trigger>
          <Tab.Trigger value="servicios">Servicios</Tab.Trigger>
        </Tab.List>

        <div className="p-5">
          {!historia ? (
            <p className="text-5 py-8 text-center text-zinc-400">
              Sin historia médica registrada para este periodo.
            </p>
          ) : (
            <>
              <Tab.Panel value="consulta" scrollable={false}>
                <ConsultaSection historia={historia} />
              </Tab.Panel>
              <Tab.Panel value="signos" scrollable={false}>
                <SignosVitalesSection info={historia.informacion_fisica} />
              </Tab.Panel>
              <Tab.Panel value="ant-patologicos" scrollable={false}>
                <FieldsSection fields={buildAntPatFields(historia.antecedentes_patologicos)} />
              </Tab.Panel>
              <Tab.Panel value="ant-familiares" scrollable={false}>
                <FieldsSection fields={buildAntFamFields(historia.antecedentes_familiares)} />
              </Tab.Panel>
              <Tab.Panel value="aparatos" scrollable={false}>
                <FieldsSection fields={buildAparSistFields(historia.aparatos_sistemas)} />
              </Tab.Panel>
              <Tab.Panel value="inmunizaciones" scrollable={false}>
                <InmunizacionesSection inm={historia.inmunizaciones} />
              </Tab.Panel>
              <Tab.Panel value="plan" scrollable={false}>
                <PlanEstudioSection plan={historia.planes_estudio} />
              </Tab.Panel>
              <Tab.Panel value="servicios" scrollable={false}>
                <ServiciosSection servicios={historia.servicios} />
              </Tab.Panel>
            </>
          )}
        </div>
      </Tab>
    </div>
  )
}
