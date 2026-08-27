# 06 · Referencia de endpoints

Base URL en dev: `http://localhost:8000`. Todas las respuestas son JSON. Salvo
las marcadas como **pública**, requieren sesión (cookie `connect.sid`). Los
routers `/medicina/*` y `/nutricion/*` exigen además el área correspondiente
(admin siempre pasa).

Convenciones de la tabla:

- **Auth**: `sesión` = requiere login; `+priv` = COORDINADOR o ADMIN; `+área` = área del router.
- Los listados devuelven `{ <recurso>: [...], count }`. Los `:id` son UUID.

## Autenticación · `/auth`

| Método | Path                          | Auth    | Body / Query                                     | Respuesta                                     |
| ------ | ----------------------------- | ------- | ------------------------------------------------ | --------------------------------------------- |
| POST   | `/auth/login`                 | pública | `{ email, password }`                            | `{ ok: true }` + cookie                       |
| GET    | `/auth/me`                    | sesión  | —                                                | `{ id, nombre, correo, foto, rol, area }`     |
| POST   | `/auth/logout`                | sesión  | —                                                | `{ ok: true }`                                |
| PATCH  | `/auth/password`              | sesión  | `{ currentPassword, password, confirmPassword }` | `{ message }`                                 |
| POST   | `/auth/password/forgot`       | pública | `{ correo }`                                     | `{ message }`                                 |
| GET    | `/auth/password/reset/:token` | pública | —                                                | `{ correo }` (para la leyenda de la pantalla) |
| POST   | `/auth/password/reset`        | pública | `{ token, password, confirmPassword }`           | `{ message }`                                 |

`login`, `forgot` y `reset` tienen rate limit propio.

## Usuarios · `/usuarios`

| Método | Path                 | Auth    | Notas                                                                          |
| ------ | -------------------- | ------- | ------------------------------------------------------------------------------ |
| POST   | `/usuarios/registro` | pública | Completa el registro con `{ token, ... }` de una invitación                    |
| GET    | `/usuarios`          | +priv   | Query: `status, rol, sortBy, search, page, limit`. Devuelve `{ users, count }` |
| POST   | `/usuarios`          | +priv   | Crea usuario                                                                   |
| GET    | `/usuarios/:id`      | sesión  | —                                                                              |
| PATCH  | `/usuarios/:id`      | +priv   | Desactivar sigue la jerarquía de roles                                         |
| DELETE | `/usuarios/:id`      | +priv   | Soft-delete; sigue la jerarquía de roles                                       |

Los no-admin quedan filtrados por su `area_id`.

## Invitaciones · `/invitaciones`

| Método | Path                     | Auth    | Notas                                          |
| ------ | ------------------------ | ------- | ---------------------------------------------- |
| GET    | `/invitaciones/:token`   | pública | Valida un token para la pantalla de registro   |
| POST   | `/invitaciones`          | +priv   | Emite una invitación `{ correo, rol, ... }`    |
| POST   | `/invitaciones/reenviar` | +priv   | Reenvía el correo                              |
| DELETE | `/invitaciones`          | +priv   | Elimina una invitación pendiente (hard delete) |

## Pacientes · `/pacientes`

| Método | Path                   | Auth   | Notas                                                                                             |
| ------ | ---------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| GET    | `/pacientes`           | sesión | Query: `search, sortBy, genre, page, limit`. `{ patients, count }`                                |
| POST   | `/pacientes`           | sesión | Crea paciente                                                                                     |
| GET    | `/pacientes/similares` | sesión | Query: `nombre, apellidos, fecha_nacimiento, genero`. Candidatos de la otra área para sincronizar |
| GET    | `/pacientes/:id`       | sesión | Incluye `areas: [...]` (áreas a las que pertenece)                                                |
| PATCH  | `/pacientes/:id`       | sesión | —                                                                                                 |
| DELETE | `/pacientes/:id`       | sesión | Soft-delete. Un paciente compartido entre áreas solo lo borra un admin                            |

## Medicina · `/medicina` (requiere área MEDICINA o admin)

| Método               | Path                              | Notas                                                                                                                           |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| POST                 | `/medicina/pacientes`             | Registro atómico: paciente + historia médica en una transacción. Acepta `pacienteId` para sincronizar con un paciente existente |
| GET · POST           | `/medicina/historias-medicas`     | Listado por `?paciente_id=`. CRUD estándar                                                                                      |
| GET · PATCH · DELETE | `/medicina/historias-medicas/:id` | —                                                                                                                               |
| GET · POST           | `/medicina/notas-evolucion`       | Listado por `?historia_medica_id=` (obligatorio)                                                                                |
| GET · PATCH · DELETE | `/medicina/notas-evolucion/:id`   | —                                                                                                                               |
| GET · POST           | `/medicina/emergencias`           | Bitácora de emergencias                                                                                                         |
| GET · PATCH · DELETE | `/medicina/emergencias/:id`       | —                                                                                                                               |

## Nutrición · `/nutricion` (requiere área NUTRICION o admin)

Registro e historia:

| Método               | Path                                 | Notas                                                                                   |
| -------------------- | ------------------------------------ | --------------------------------------------------------------------------------------- |
| POST                 | `/nutricion/pacientes`               | Registro atómico paciente + historia de nutrición. Acepta `pacienteId` para sincronizar |
| GET · POST           | `/nutricion/historias-nutricion`     | Listado por `?paciente_id=`                                                             |
| GET · PATCH · DELETE | `/nutricion/historias-nutricion/:id` | —                                                                                       |

Evaluaciones y seguimiento. Todas siguen el mismo patrón CRUD y su **listado se
scopea por `?historia_paciente_id=` (UUID obligatorio)**:

| Recurso                                     | Path base                                |
| ------------------------------------------- | ---------------------------------------- |
| Evaluación bioquímica                       | `/nutricion/evaluacion-bioquimica`       |
| Evaluación nutricional (frecuencia/hábitos) | `/nutricion/evaluacion-nutricional`      |
| Examinación física                          | `/nutricion/examinacion-fisica`          |
| Evaluación antropométrica                   | `/nutricion/evaluacion-antropometrica`   |
| Requerimientos (GET)                        | `/nutricion/cal-get-nutr`                |
| Recordatorio 24h                            | `/nutricion/rec-24h`                     |
| Calidad del sueño                           | `/nutricion/evaluacion-sueno`            |
| Actividad física                            | `/nutricion/evaluacion-actividad-fisica` |
| TPAN                                        | `/nutricion/tpan`                        |
| Reporte EEN                                 | `/nutricion/reporte-een`                 |

Cada uno expone:

```
GET    /<recurso>?historia_paciente_id=<uuid>   → { <items>, count }
POST   /<recurso>                                → 201 { message, ... }
GET    /<recurso>/:id
PATCH  /<recurso>/:id
DELETE /<recurso>/:id
```

## Auditoría · `/audit`

| Método | Path         | Auth  |
| ------ | ------------ | ----- | ----------------------------- |
| GET    | `/audit`     | +priv | Listado filtrable de acciones |
| GET    | `/audit/:id` | +priv |

## Estadísticas · `/stats`

| Método | Path     | Auth   |
| ------ | -------- | ------ | -------------------------------------------------------- |
| GET    | `/stats` | sesión | Métricas del dashboard (acotadas por área para no-admin) |

## CIE-11 · `/icd11`

| Método | Path                  | Auth   | Notas                                                                 |
| ------ | --------------------- | ------ | --------------------------------------------------------------------- |
| GET    | `/icd11/search?q=...` | sesión | Proxy a la API ICD-11 de la OMS. Devuelve `[{ codigo, descripcion }]` |

## Salud

| Método | Path      | Auth    |
| ------ | --------- | ------- | ------------------ |
| GET    | `/health` | pública | `{ status: 'ok' }` |
