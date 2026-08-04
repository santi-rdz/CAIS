import { GRUPOS_EQUIVALENTES } from '@cais/shared/constants/nutricion'
import { GET_INPUT_FIELDS } from '@features/patients/nutricion/forms/CalGetNutrForm/fieldConfig'

// Todos los campos arrancan vacíos (inputs controlados). El schema compartido
// convierte '' → undefined; en create se omiten con omitEmpty.
const emptyGet = Object.fromEntries(GET_INPUT_FIELDS.map((f) => [f.name, '']))
const emptyEquivalentes = Object.fromEntries(GRUPOS_EQUIVALENTES.map((g) => [g, '']))

export const CAL_GET_NUTR_DEFAULTS = { ...emptyGet, ...emptyEquivalentes }
