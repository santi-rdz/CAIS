# Documentación CAIS

Sistema de administración del **Centro de Atención Integral para la Salud (CAIS)**
de la UABC. Gestiona pacientes, historias clínicas y evaluaciones de dos áreas
(Medicina y Nutrición), con control de acceso por rol y área.

Esta carpeta es el punto de entrada para cualquier persona que se integra al
proyecto. Está organizada por rubro; léela en orden si es tu primer día.

## Mapa de la documentación

| #   | Documento                                                    | Qué cubre                                                                  |
| --- | ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 01  | [Arquitectura](./01-arquitectura.md)                         | Monorepo, workspaces, stack, cómo viaja una request                        |
| 02  | [Entorno local](./02-entorno-local.md)                       | Requisitos, setup, comandos, puertos                                       |
| 03  | [Base de datos y Prisma](./03-base-de-datos-y-prisma.md)     | Schema, UUIDs, soft-delete, timestamps, fechas, migraciones                |
| 04  | [Autenticación y permisos](./04-autenticacion-y-permisos.md) | Sesiones, roles, áreas, registro por invitación                            |
| 05  | [API del backend](./05-api-backend.md)                       | Anatomía de un endpoint, formato de respuesta, errores, paginación         |
| 06  | [Referencia de endpoints](./06-referencia-de-endpoints.md)   | Todos los endpoints por dominio                                            |
| 07  | [Frontend](./07-frontend.md)                                 | Services, TanStack Query, formularios, permisos de UI                      |
| 08  | [Flujos clave](./08-flujos-clave.md)                         | Registro, sincronización multi-área, historia clínica, reset de contraseña |

## Resumen en 30 segundos

- **Monorepo pnpm** con cuatro workspaces: `shared/`, `backend/`, `frontend/`, `database/`.
- **JavaScript puro** en todos lados (no TypeScript). Autocompletado vía `jsconfig.json`.
- **Backend**: Express 5 + Prisma 7 + MySQL 8. Sesión con cookie (no JWT).
- **Frontend**: React 19 + Vite + Tailwind v4 + TanStack Query.
- **`shared/`**: esquemas Zod y constantes que backend y frontend comparten.
- Idioma: mensajes al usuario y columnas de DB en **español**; helpers y clases en **inglés**.

## Regla de oro antes de escribir código

Lee el patrón existente más cercano (otro controller, otro hook, otro schema) y
replícalo. La consistencia del código es una regla dura del proyecto — está
documentada en los `CLAUDE.md` de la raíz y de cada workspace.
