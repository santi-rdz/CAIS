# Plan — Construcción de campos de form desde schemas planos

> Estado: propuesta para PR futura. No implementar en la PR actual.

## Contexto

En `feat/nutritional-medical-full` se introdujo
`frontend/src/features/patients/nutricion/forms/monitoreoRows.js`, que deriva el
shape de las filas de monitoreo (sueño / actividad física) **desde el schema Zod**
en vez de repetir listas de campos a mano:

```js
export const SUENO_ROW_KEYS = Object.keys(evalCalSuenoSchema.shape)
export function buildMonitoringRow(keys, row) {
  /* fecha → dayjs, resto → '' */
}
export function buildMonitoringFieldRow(keys, row) {
  /* + _deleted */
}
```

Esto eliminó la duplicación que existía en 4 lugares (schema, `ROW_KEYS`,
`getDefaultValues`, `buildDefaults`). Esta PR generaliza ese patrón a **todas las
filas/forms planos** del frontend y migra los casos hardcodeados que quedan.

## Precondición: qué es un "schema plano"

El patrón **solo** aplica cuando el shape cumple TODO esto:

1. Todos los campos son escalares: `string`, `number` o `date`. Sin `z.object`
   anidado, sin arrays.
2. El default de cada campo es uniforme y derivable mecánicamente:
   - campo fecha → `dayjs()` (o `dayjs(valor)` al editar)
   - cualquier otro → `''` (input controlado vacío)
3. No hay defaults semánticos por campo (booleans en `false`, enums en `'no'`,
   tri-estado en `undefined`, fecha en `null`). Eso es decisión de dominio, NO
   mecánica, y vive en un `DEFAULT_VALUES` explícito.

### No-objetivos (NO migrar)

- `MedicalPatientForm/formConfig.js#DEFAULT_VALUES` y el equivalente estático de
  nutrición: heterogéneos (booleans, enums, objetos anidados, `null` vs `dayjs`).
  El `DEFAULT_VALUES` explícito es la forma correcta — no es deuda.
- Sub-objetos anidados (`antecedentes_familiares`, `servicios`,
  `inmunizaciones`): aunque sus campos sean planos, el default por campo varía
  (`servicios` son booleans). Quedan fuera salvo que se confirme uniformidad.
- Forms con `refine`/confirmar-password, o con campos auxiliares que el schema no
  tiene (`presenta_*`, `fecha`+`hora` partidos).

## Alcance concreto

### 1. Promover el helper a ubicación compartida y area-agnóstica

Mover/renombrar `monitoreoRows.js` →
`frontend/src/features/patients/shared/forms/schemaRows.js` (o `@lib`), sin
acoplamiento a nutrición. API propuesta:

```js
// keys derivadas de cualquier schema plano
export function schemaKeys(schema) {
  return Object.keys(schema.shape)
}

// fila de defaults para el form (modal): fecha → dayjs, resto → ''
export function buildSchemaRow(schema, row, { dateKeys } = {}) { ... }

// fila para field arrays del wizard: + flag solo-UI _deleted
export function buildSchemaFieldRow(schema, row, opts) { ... }
```

Recibir el `schema` (no solo `keys`) permite el **guard de planitud** (ver
Decisiones abiertas) y centraliza la detección de campos fecha.

### 2. Migrar los casos hardcodeados existentes

En `nutricion/forms/NutritionalPatientForm/formHelpers.js`:

- `ENFERMEDAD_ROW_KEYS = ['enfermedad','evol','farmacos','dosis']`
  → `schemaKeys(historiasMedicasNutricionSchema)`
- `TRATAMIENTO_ROW_KEYS = ['producto','cual_producto','mejora','dosis']`
  → `schemaKeys(tratamientoAltNutricionSchema)`
- `mapRows(rows, keys)` → reusar `buildSchemaFieldRow` (hoy duplica el
  `Object.fromEntries(... ?? '')` que ya está en el helper).

Revisar `medicina/forms/MedicalPatientForm/formHelpers.js` por listas de keys
planas equivalentes (no aparecieron `ROW_KEYS` en el barrido, confirmar).

### 3. Dejar listo para las áreas futuras

`shared/schemas/nutricion/` ya tiene decenas de sub-schemas planos sin UI aún
(`biochemicalEval.js`, `physicalExam.js`, `nutritionalEval.js`). Cuando se
construyan sus modales add/edit (mismo patrón que sueño/AF), deben consumir el
helper desde el día 1 en vez de re-listar campos. Documentarlo en
`frontend/CLAUDE.md` (sección Formularios).

## Diseño: detección de campos fecha

El factory actual hardcodea `if (k === 'fecha')`. Generalización (elegir una):

- **(A) Convención de nombre** — keys `fecha` o `/^fecha/` (`fecha_ingreso`,
  `fecha_eval`) → dayjs. Cubre todos los schemas actuales. Simple, sin
  introspección de Zod. Riesgo: un campo fecha con otro nombre se trataría como
  string.
- **(B) `dateKeys` explícito por schema** — verboso pero infalible.
- **(C) Introspección de Zod** — comparar el sub-schema contra
  `optionalDateSchema`/`dateSchema` de `shared/schemas/fields.js`. Frágil a través
  de wrappers `.optional()`/`.nullable()`.

**Recomendado: (A) con override (B) opcional** —
`buildSchemaRow(schema, row, { dateKeys })` usa convención por defecto y permite
pasar `dateKeys` cuando un schema rompa la convención.

## Guard de planitud (fail-loud)

El helper debe detectar mal uso en dev: si algún campo del shape es un `z.object`
(tiene `.shape`) o array, lanzar error claro en vez de producir defaults
silenciosamente incorrectos. Evita que alguien aplique el patrón a un schema
heterogéneo.

## Pasos de implementación

1. Crear `shared/forms/schemaRows.js` con `schemaKeys`, `buildSchemaRow`,
   `buildSchemaFieldRow` + guard + detección de fecha (A).
2. Tests unitarios (Vitest): schema plano → keys correctas, fecha → dayjs, resto
   → '', `_deleted` en la variante field-row, guard lanza con schema anidado.
3. Reescribir `monitoreoRows.js` como re-export delgado del helper compartido (o
   eliminarlo y actualizar imports).
4. Migrar `ENFERMEDAD_ROW_KEYS` / `TRATAMIENTO_ROW_KEYS` / `mapRows`.
5. Auditar medicina por el mismo patrón.
6. Documentar el contrato en `frontend/CLAUDE.md`.
7. `pnpm run check` + `vite build` + smoke test manual de crear/editar paciente
   en ambas áreas.

## Riesgos / decisiones abiertas

- **Orden de keys**: `Object.keys(schema.shape)` puede diferir del array manual
  (pasó con `intensidad`/`clasif_tiempo_af` en AF). Es irrelevante para el shape
  del objeto, pero confirmar que ningún consumidor dependa del orden posicional.
- **Campos número como `''`**: hoy funciona porque el backend coacciona; validar
  que sigue siendo así si se migran schemas con más enteros.
- **`shared/` sigue siendo el contrato del backend**: NO meter defaults de
  presentación (`''`, `dayjs`) en los schemas de `shared/`. El default vive en el
  helper del FE, no en el schema. (Ver `frontend/CLAUDE.md`, capa `@schemas/`.)

## Verificación de éxito

Agregar un campo a un schema plano (ej. `evalCalSuenoSchema`) debe propagarse a
defaults, mapeo DB→form y limpieza **sin tocar ningún otro archivo** del FE.
