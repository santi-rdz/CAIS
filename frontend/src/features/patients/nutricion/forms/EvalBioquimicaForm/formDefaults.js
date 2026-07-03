import {
  PERFIL_ANEMIA_FIELDS,
  PERFIL_ENDOCRINO_FIELDS,
  PERFIL_RENAL_FIELDS,
  PERFIL_LIPIDOS_FIELDS,
  BALANCE_ACIDO_BASE_FIELDS,
  PERFIL_ORINA_FIELDS,
  PERFIL_INFLAMATORIO_FIELDS,
  EVAL_ESTADO_NUTRICION_FIELDS,
} from '@features/patients/nutricion/forms/EvalBioquimicaForm/fieldConfig'

// Deriva los default values ('' por campo) directamente de fieldConfig.js, en
// vez de repetir la lista de nombres de campo por cada sub-perfil — una sola
// fuente de verdad para "qué campos tiene cada perfil".
function buildDefaults(fields) {
  return Object.fromEntries(fields.map(({ name }) => [name, '']))
}

export const PERFIL_ANEMIA_DEFAULTS = buildDefaults(PERFIL_ANEMIA_FIELDS)
export const PERFIL_ENDOCRINO_DEFAULTS = buildDefaults(PERFIL_ENDOCRINO_FIELDS)
export const PERFIL_RENAL_ELECTROLITOS_DEFAULTS = buildDefaults(PERFIL_RENAL_FIELDS)
export const PERFIL_LIPIDOS_DEFAULTS = buildDefaults(PERFIL_LIPIDOS_FIELDS)
export const BALANCE_ACIDO_BASE_DEFAULTS = buildDefaults(BALANCE_ACIDO_BASE_FIELDS)
export const PERFIL_ORINA_DEFAULTS = buildDefaults(PERFIL_ORINA_FIELDS)
export const PERFIL_INFLAMATORIO_DEFAULTS = buildDefaults(PERFIL_INFLAMATORIO_FIELDS)
export const EVAL_ESTADO_NUTRICION_DEFAULTS = buildDefaults(EVAL_ESTADO_NUTRICION_FIELDS)
