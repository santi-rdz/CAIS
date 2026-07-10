import { REC24H_NUTRIENTES } from '@features/patients/nutricion/constants'

// Objetivos (obj_*) vacíos + lista de alimentos vacía. Las comidas se administran
// como lista de objetos (AlimentoField), no como campos planos del form.
const emptyObjetivos = Object.fromEntries(REC24H_NUTRIENTES.map((n) => [n.objName, '']))

export const REC24H_DEFAULTS = {
  ...emptyObjetivos,
  comidas: [],
}
