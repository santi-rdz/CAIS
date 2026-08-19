import { z } from 'zod'
import {
  reporteEenAdultoSchema,
  reporteEenKidSchema,
} from '@cais/shared/schemas/nutricion/eenReport'

// El form es plano (sin anidar bajo `adulto`/`kid`); el componente envuelve los
// campos bajo la llave del tipo al enviar. fecha_eval viaja como dayjs desde el
// DatePicker y se convierte a ISO antes de mandar. El resto reutiliza la
// validación compartida tal cual.
const fechaField = { fecha_eval: z.any().optional() }

// El select entrega 'true'/'false'/'' pero la DB guarda booleano: se coacciona
// antes de validar contra el boolean del schema compartido.
const solicitoOrientField = z.preprocess(
  (v) => (v === '' || v == null ? null : v === 'true' ? true : v === 'false' ? false : v),
  z.boolean().nullish()
)

export const eenAdultoFormSchema = reporteEenAdultoSchema.extend(fechaField)

export const eenKidFormSchema = reporteEenKidSchema.extend({
  ...fechaField,
  solicito_orient: solicitoOrientField,
})

export const eenFormSchema = (esAdulto) => (esAdulto ? eenAdultoFormSchema : eenKidFormSchema)
