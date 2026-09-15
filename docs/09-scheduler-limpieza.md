# 09 · Scheduler de limpieza

Job programado que borra filas expiradas que de otro modo crecen sin límite:
sesiones vencidas, tokens de reset de contraseña e invitaciones de registro
vencidas/usadas. `registro_auditoria` **no** entra aquí — es un log de
auditoría, crecer es su función.

## Archivos

| Archivo                                     | Rol                                                                    |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| `backend/src/jobs/cleanupExpiredRecords.js` | Función centralizada: un `$transaction` con los 3 `deleteMany`         |
| `backend/src/jobs/scheduler.js`             | Programa la función con `node-cron` (`startScheduler`/`stopScheduler`) |
| `backend/src/server.js`                     | Llama `startScheduler()` al boot y `stopScheduler()` en el shutdown    |
| `backend/src/lib/constants.js`              | `CLEANUP_CRON_SCHEDULE`, `USED_TOKEN_GRACE_MS`                         |

## Qué borra y cuándo

```js
// cleanupExpiredRecords.js
sessions            → expire < ahora
password_reset_tokens → expira_at < ahora  OR  (usado=true Y created_at < ahora - 24h)
invitaciones_registro → expira_at < ahora  OR  (usado=true Y created_at < ahora - 24h)
```

Un token/invitación usado no se borra al instante: se guarda `USED_TOKEN_GRACE_MS`
(24h) por si hace falta auditar "esto ya se usó".

## Programación

`CLEANUP_CRON_SCHEDULE = '0 3 * * *'` — diario, 3:00am. Sin urgencia real de
borrar más seguido: las filas vencidas ya están inertes (una sesión vencida no
autentica, un token vencido no valida), esto es solo housekeeping. Diario es el
estándar para apps de este tamaño; cambiar el intervalo es editar esa constante.

`node-cron` con `{ noOverlap: true }`: si una corrida tarda más que el
intervalo, la siguiente se salta en vez de apilarse.

## Dónde corre

Solo se activa desde `server.js` (el proceso real). **No corre en tests**
(Jest importa `app.js`, no `server.js`) ni si solo levantas la app con
`supertest`. Un solo proceso backend en este stack (`docker-compose.yml`), así
que no hay riesgo de que dos instancias lo corran a la vez — si eso cambia
algún día, agregar locking (`{ distributed: true }` de node-cron, o un lock a
mano) antes de escalar horizontalmente.

## Probar en dev

El scheduler solo corre en el próximo tick del cron (con `'0 3 * * *'`, hasta
24h de espera). Para probar sin esperar:

1. Cambiar temporalmente `CLEANUP_CRON_SCHEDULE` a `'* * * * *'` (cada minuto)
   en `constants.js` — el backend en dev corre con `--watch-path=src`, se
   reinicia solo al guardar.
2. O disparar la función a mano, sin tocar el cron:
   ```bash
   cd backend
   node --env-file-if-exists=../.env -e "
   import('#jobs/cleanupExpiredRecords.js').then(async (m) => {
     console.log(await m.cleanupExpiredRecords())
     process.exit(0)
   })
   " --input-type=module --conditions=node
   ```
3. El seed deja un caso ya vencido listo para probar:
   `invitaciones_registro.correo = 'pasante.expirado@uabc.edu.mx'`.

**Revertir siempre** el cambio del paso 1 antes de commitear — `'0 3 * * *'` es
el valor de producción.

## Errores

Un fallo en la corrida no tumba el proceso: se captura y se loguea vía
`.on('execution:failed', ...)` en `scheduler.js`. Revisar logs del backend si
se sospecha que dejó de correr.
