# 08 · Flujos clave

Recorridos end-to-end de los procesos que más se tocan. Cada uno cruza varios
workspaces; úsalos como mapa antes de modificar código relacionado.

## 1. Registro de un usuario (por invitación)

No existe registro abierto: siempre parte de una invitación.

```
COORDINADOR/ADMIN                       Invitado
      │                                    │
      │ POST /invitaciones                 │
      │   { correo, rol }                  │
      │──► crea invitaciones_registro      │
      │    (token UUID, correo, rol)       │
      │──► envía correo con link ──────────►│  abre el link
      │                                     │  GET /invitaciones/:token  (valida)
      │                                     │
      │                    POST /usuarios/registro
      │                      { token, nombre, correo, password, ... }
      │                        · valida token (no usado, no expirado)
      │                        · el schema depende del rol de la invitación
      │                        · crea usuario con hash bcrypt
```

`POST /usuarios/registro` es público (va antes de `requireAuth`).

## 2. Registro de un paciente + sincronización multi-área

Un paciente puede ser atendido por **ambas áreas**. La tabla puente
`pacientes_areas` guarda a qué áreas pertenece. El registro es **atómico**:
paciente + su primera historia en una sola transacción.

```
POST /medicina/pacientes   ó   POST /nutricion/pacientes
   { datos del paciente, datos de la historia, [pacienteId] }
```

- **Sin `pacienteId`** → crea el paciente, lo asocia a `pacientes_areas` con el
  área del usuario, y crea su primera historia (médica o de nutrición).
- **Con `pacienteId`** → es una **sincronización**: el paciente ya existe en la
  otra área; solo se agrega la membresía de esta área y su historia. Los datos
  personales que ya estaban NO se sobrescriben; solo se rellenan los vacíos.

### Cómo el frontend sugiere sincronizar

Al capturar los 4 campos ancla (nombre, apellidos, fecha de nacimiento, género)
en el alta, el frontend consulta:

```
GET /pacientes/similares?nombre=&apellidos=&fecha_nacimiento=&genero=
```

que busca pacientes de **la otra área** con esos datos (match exacto de fecha —
por eso importa el contrato de fechas de [03](./03-base-de-datos-y-prisma.md)) y
devuelve candidatos con un score de similitud de nombre. Si hay match, se ofrece
sincronizar y el `POST` de registro se manda con `pacienteId`.

### En la vista de detalle

`GET /pacientes/:id` incluye `areas: [...]`. La UI muestra:

- **Admin**: el `AreaSwitcher` con las áreas del paciente (tab estática si es una sola).
- **Pasante/Coordinador**: un badge "También es paciente en …" si además está en otra área.

## 3. Historia clínica y sus sub-recursos

Cada área tiene su historia y, colgando de ella, evaluaciones/notas.

```
paciente
  └── historia (médica  ó  de nutrición)          [1 por periodo]
        ├── medicina:  notas de evolución
        └── nutrición: eval. bioquímica, antropométrica, nutricional,
                       examinación física, GET, rec-24h, sueño,
                       actividad física, TPAN, reporte EEN
```

Puntos clave:

- Todo sub-recurso **cuelga de la historia** (`historia_paciente_id` en nutrición,
  `historia_medica_id` en medicina). El `paciente_id` se **deriva** de la
  historia en `formatX`, no se guarda ni se manda en el body.
- Su listado **se scopea por el id de la historia** (query param UUID obligatorio),
  si no expondría filas de todos los pacientes.
- Crear un sub-recurso valida que la historia esté **activa** (no soft-deleted)
  con los guards de `#lib/historyGuard.js`.
- Borrar la historia (soft-delete) **oculta** sus hijos vía relation filter; no se
  cascadea el soft-delete a cada hijo.

## 4. Recuperar / cambiar contraseña

**Cambio con sesión** (desde configuración):

```
PATCH /auth/password   { currentPassword, password, confirmPassword }
  · verifica currentPassword (bcrypt)
  · la nueva no puede ser igual a la actual
  · regenera la sesión
```

**Olvidé mi contraseña** (sin sesión, reutiliza la página de Auth):

```
1. POST /auth/password/forgot   { correo }
     → si el correo existe, genera un token y envía un link por correo
       (respuesta uniforme para no revelar si el correo existe)

2. GET /auth/password/reset/:token
     → devuelve { correo } para mostrarlo como leyenda en la pantalla

3. POST /auth/password/reset   { token, password, confirmPassword }
     → valida el token (no usado, no expirado)
     → la nueva no puede ser igual a la actual (bcrypt.compare contra el hash viejo)
```

Los tres endpoints tienen rate limit.

## 5. Diagnósticos CIE-11 (ICD-11 de la OMS)

Los códigos de diagnóstico no están hardcodeados: se consultan en vivo a la API
ICD-11 de la OMS a través de una capa en el backend.

```
Frontend (autocomplete)
   │  GET /icd11/search?q=diabetes
   ▼
Icd11Controller ──► services/icd11.js
   · cachea el token OAuth de la OMS
   · consulta la API y normaliza a [{ codigo, descripcion }]
   · si la OMS falla → BadGatewayError (502)
```

El frontend lo consume con el hook `useIcd11Search` (debounced) y lo usa en los
campos de diagnóstico de medicina.
