# Plan: registro atómico de paciente + historia (medicina y nutrición)

> PR aparte. Diseñado siguiendo principios REST (resource-oriented, semántica HTTP
> correcta, validación en capas) y los estándares de `backend/CLAUDE.md` y
> `frontend/CLAUDE.md`.

## Problema

El registro de un paciente toca **dos recursos** (paciente + su primera historia)
mediante **dos requests HTTP separados**, cada uno con su propia `$transaction`:

```
POST /pacientes                      → tx1: crea paciente   (commit)
POST /nutricion/historias-nutricion  → tx2: crea historia   (commit)
```

El hook del frontend encadena ambas y, si la segunda falla, hace `deletePatient`
desde el cliente como "rollback". No hay atomicidad entre los dos commits:

- Si la creación de la historia falla **y** el `deletePatient` también (red caída,
  500, browser cerrado), queda un **paciente huérfano** sin historia; solo se
  loguea en consola.
- Entre tx1 y tx2 el paciente existe en estado incompleto (lo puede leer otra
  request).

Es un hueco de correctitud de baja probabilidad (no un crash). **Aplica igual a
medicina y nutrición** (hooks gemelos `useCreatePatientWithHistory` /
`useCreatePatientWithNutritionHistory`).

## Solución: una sola transacción server-side

Un endpoint **por área** que cree paciente + 1ª historia + auditorías dentro de
un único `prisma.$transaction`. Si algo truena, Prisma revierte todo → el
huérfano es imposible y el rollback de cliente sobra.

### Diseño de API

```
POST /nutricion/pacientes   → registra paciente + 1ª historia nutricional (atómico)
POST /medicina/pacientes    → registra paciente + 1ª historia médica (atómico)
```

Por qué así (resource-oriented, no `POST /createPatientWithHistory`):

- Es un recurso (la colección "pacientes del área"), no una acción imperativa.
- Hereda `requireArea(AREA)` del router del área (`routes/nutrition.js`,
  `routes/medicine.js`).
- Los endpoints existentes (`POST /pacientes`, `POST /{area}/historias-*`) **se
  conservan** — siguen siendo recursos válidos (crear paciente solo; crear
  historia para un paciente existente). Solo cambia la orquestación del registro.

**Request body** (nested, sin ambigüedad de a qué entidad pertenece cada campo):

```json
{
  "patient": { "nombre": "...", "apellidos": "...", "...": "..." },
  "historia": { "motivo_consulta": "...", "adicciones": {}, "...": "..." }
}
```

> `historia` **sin** `paciente_id` (se inyecta dentro del tx tras crear el paciente).

**Respuestas:**

| Código | Caso                                     |
| ------ | ---------------------------------------- |
| `201`  | `{ message, patient, historia }`         |
| `422`  | `ValidationError` + `fields` (Zod)       |
| `401`  | sin sesión                               |
| `403`  | sin área (`requireArea`)                 |
| `500`  | error inesperado (transacción revertida) |

Sin versionado (consistente con la API interna, que no usa `/v1`).

## Backend

1. **Shared schema** — `shared/schemas/{nutricion,medicina}/patientRegistration.js`:

   ```js
   import { z } from 'zod'
   import { patientSchema } from '../medicina/patient.js'
   import { nutritionHistorySchema } from './nutritionHistory.js'

   export const nutritionRegistrationSchema = z.object({
     patient: patientSchema,
     historia: nutritionHistorySchema.omit({ paciente_id: true }),
   })

   export function validateNutritionRegistration(input) {
     return nutritionRegistrationSchema.safeParse(input)
   }
   ```

   Reutiliza los schemas existentes (cero validación nueva). Actualizar
   `shared/package.json#exports` si el sub-path no está cubierto.

2. **Controller** — `controllers/nutricion/patientRegistration.js`. Una sola
   `$transaction` que compone los modelos que **ya reciben `tx`**:

   ```js
   const result = validateNutritionRegistration(req.body)
   if (result.error) {
     return res.status(422).json({
       error: 'ValidationError',
       message: 'Datos de registro inválidos',
       fields: formatZodErrors(result.error),
     })
   }
   const { patient, historia } = result.data
   try {
     const data = await prisma.$transaction(async (tx) => {
       const p = await PatientModel.create(patient, req.session.userId, tx)
       const h = await NutritionHistoryModel.create({ ...historia, paciente_id: p.id }, tx)
       await AuditModel.create(
         {
           usuario_id: req.session.userId,
           accion: ACCIONES.CREAR,
           entidad: ENTIDADES.PACIENTE,
           objetivo_id: p.id,
           paciente_id: p.id,
         },
         tx
       )
       await AuditModel.create(
         {
           usuario_id: req.session.userId,
           accion: ACCIONES.CREAR,
           entidad: ENTIDADES.HISTORIA_NUTRICION,
           objetivo_id: h.id,
           paciente_id: p.id,
         },
         tx
       )
       return { patient: p, historia: h }
     })
     return res.status(201).json({ message: 'Paciente registrado', ...data })
   } catch (err) {
     console.error('Error al registrar paciente de nutrición:', err)
     return res.status(500).json({ error: 'Error al registrar al paciente' })
   }
   ```

3. **Route** — montar bajo el router del área (que ya aplica `requireArea`):

   ```js
   nutritionRouter.use('/pacientes', nutritionPatientRegistrationRouter) // POST /
   ```

4. **Modelos** — sin cambios: `PatientModel.create(data, userId, tx)` y
   `NutritionHistoryModel.create(data, tx)` ya aceptan `tx`.

## Frontend

5. **Service** — `registerNutritionPatient(body)` → `POST /nutricion/pacientes`
   (en `apiNutritionHistory.js` o nuevo `apiNutritionPatient.js`).

6. **Hook** — `useCreatePatientWithNutritionHistory.js` colapsa a **una mutación**:

   ```js
   mutationFn: ({ patientData, historyData }) =>
     registerNutritionPatient({ patient: patientData, historia: historyData })
   ```

   - `splitFormData` se **reutiliza tal cual** (sigue partiendo el form flat en
     `{ patientData, historyData }`).
   - Mantener invalidaciones: `['patients']`, `['nutrition-histories']`,
     `['dashboard-stats']`.

7. **Mapeo de errores 422** — el body es nested, así que `formatZodErrors`
   emitirá paths `patient.nombre` / `historia.x`. El handler que hace `setError`
   debe **quitar el prefijo** `patient.` / `historia.` para casar con los campos
   planos del RHF. (Verificar el shape real que produce `formatZodErrors`.)

## Limpieza para no dejar basura (checklist)

Tras reescribir cada hook:

- [ ] `deletePatient` — quitar el **import** del hook (no la función del service:
      la usa el flujo de borrado). Verificar otros callers con grep.
- [ ] `createNutritionHistory` / `createMedicalHistory` (services) — si quedan
      **sin callers**, borrarlos (se re-agregan cuando exista "nueva historia para
      paciente existente"). Verificar con grep antes de borrar.
- [ ] Eliminar el `try/catch` de rollback y el `console.error` de huérfano.
- [ ] `grep` final de imports/funciones huérfanas en `services/` y `hooks/`.

## Replicar en medicina (mismo patrón)

- `shared/schemas/medicina/patientRegistration.js`
- `controllers/medicina/patientRegistration.js`
- `POST /medicina/pacientes`
- Reescribir `useCreatePatientWithHistory.js`
- Mismo checklist de limpieza (`createMedicalHistory`, `deletePatient`).

## Tests

- Backend `__tests__/{nutritionPatientRegistration,medicalPatientRegistration}.test.js`:
  - `201` crea paciente + historia y ambos quedan en DB.
  - **`422` no crea nada** (prueba de atomicidad: contar pacientes antes/después).
  - Fallo de historia → **0 pacientes nuevos** (la transacción revierte).
  - `401` / `403`.
- Revisar/ajustar tests que asuman el flujo de dos llamadas.

## Rollout

- **No breaking**: los endpoints viejos permanecen; solo el FE deja de encadenar
  dos llamadas. Se puede mergear sin coordinar despliegues.
- Orden de commits sugerido:
  1. shared schemas
  2. backend nutrición + tests
  3. backend medicina + tests
  4. frontend hooks + limpieza
