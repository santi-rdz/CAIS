import { useFormContext } from 'react-hook-form'
import Heading from '@components/Heading'
import FormRow from '@components/FormRow'
import Input from '@components/Input'
import Divider from '@components/Divider'

function getGineAndroLabel(genero) {
  if (genero === 'Femenino') return 'Antecedentes Gineco-Obstétricos'
  if (genero === 'Masculino') return 'Antecedentes Andrológicos'
  return 'Antecedentes Gineco/Andrológicos'
}

function getGineAndroPlaceholder(genero) {
  if (genero === 'Femenino')
    return 'FUM, ciclos menstruales, gestas, partos, abortos, cesáreas, método anticonceptivo...'
  if (genero === 'Masculino')
    return 'Función sexual, enfermedades prostáticas, fertilidad...'
  return 'Antecedentes ginecológicos u andrológicos relevantes...'
}

export default function MotivoConsultaStep({ patientGenero }) {
  const { register } = useFormContext()

  return (
    <div className="space-y-5">
      <Heading as="h3" showBar required>
        Motivo de Consulta
      </Heading>

      {/* SOAP legend */}
      <p className="text-sm text-zinc-500">
        Documenta la consulta siguiendo el formato{' '}
        <span className="font-semibold text-zinc-700">SOAP</span>:{' '}
        <span className="text-zinc-600">Subjetivo · Objetivo · Análisis · Plan</span>
      </p>

      {/* motivo_consulta */}
      <FormRow htmlFor="motivoConsulta" label="Motivo de Consulta">
        <Input
          {...register('motivoConsulta')}
          id="motivoConsulta"
          textarea
          rows={6}
          placeholder="Describe el motivo de consulta del paciente"
          variant="outline"
          size="md"
        />
      </FormRow>

      {/* ant_gine_andro — visible solo si el género del paciente es conocido */}
      {patientGenero && (
        <>
          <Divider />
          <FormRow
            htmlFor="antGineAndro"
            label={getGineAndroLabel(patientGenero)}
          >
            <Input
              {...register('antGineAndro')}
              id="antGineAndro"
              textarea
              rows={4}
              placeholder={getGineAndroPlaceholder(patientGenero)}
              variant="outline"
              size="md"
            />
          </FormRow>
        </>
      )}
    </div>
  )
}
