import {
  ANTROPOMETRIA_FIELDS,
  ADULTO_OBS_FIELDS,
  KID_OBS_FIELDS,
} from '@features/patients/nutricion/forms/EenReportForm/fieldConfig'

// Inputs controlados: arrancan vacíos. El schema compartido convierte '' →
// undefined; en create se omiten con omitEmpty.
const emptyFrom = (fields) => Object.fromEntries(fields.map((f) => [f.name, '']))
const antropometria = () => ({ ...emptyFrom(ANTROPOMETRIA_FIELDS), apetito: '' })

export function buildEenDefaults(esAdulto) {
  if (esAdulto) {
    return {
      ...antropometria(),
      ...emptyFrom(ADULTO_OBS_FIELDS),
      diagnosticos: [],
    }
  }
  return {
    ...antropometria(),
    ...emptyFrom(KID_OBS_FIELDS),
    solicito_orient: null,
  }
}
