import { omitEmpty, nullifyEmpty } from '@lib/utils'

// El backend decide adulto/kid por la edad y exige el payload bajo la llave del
// tipo (`adulto` o `kid`), con exactamente uno de los dos. El form es plano, así
// que aquí se envuelve.

const tipoKey = (esAdulto) => (esAdulto ? 'adulto' : 'kid')

const cleanDiagnosticos = (rows) =>
  (Array.isArray(rows) ? rows : [])
    .map((d) => omitEmpty(d))
    .filter((d) => Object.keys(d).length > 0)

export function buildCreatePayload({ historiaId, fechaStr, campos, esAdulto }) {
  const { diagnosticos, ...rest } = campos
  const tipo = omitEmpty(rest)
  if (esAdulto) {
    const diag = cleanDiagnosticos(diagnosticos)
    if (diag.length) tipo.diagnosticos = diag
  }
  return {
    historia_paciente_id: historiaId,
    ...(fechaStr && { fecha_eval: fechaStr }),
    [tipoKey(esAdulto)]: tipo,
  }
}

// En edit solo se mandan los grupos tocados. Los diagnósticos se reenvían solo
// si su lista cambió: así el manyReplace del backend (deleteMany + create) no
// recrea todas las filas cuando el usuario editó otro campo. Los campos vacíos
// van como null para limpiarlos.
export function buildEditPayload({ fechaStr, campos, esAdulto, dirtyFields }) {
  const payload = {}
  if (dirtyFields.fecha_eval) payload.fecha_eval = fechaStr

  const { diagnosticos, ...rest } = campos
  const tipo = {}
  if (Object.keys(rest).some((k) => dirtyFields[k])) {
    Object.assign(tipo, nullifyEmpty(rest))
  }
  if (esAdulto && dirtyFields.diagnosticos) {
    tipo.diagnosticos = cleanDiagnosticos(diagnosticos)
  }
  if (Object.keys(tipo).length) payload[tipoKey(esAdulto)] = tipo
  return payload
}
