# CAIS — Roadmap a producción

Estado del setup Docker/Compose para deploy real. Generado tras auditoría de
infraestructura (ver historial de commits en `docker-compose.yml`,
`backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`).

---

## ✅ Listo

- Multi-stage Dockerfiles (`backend`, `frontend`) con stages limpias, non-root,
  healthchecks, `tini` como PID1 en el backend, image size razonable
  (~250MB backend, ~50MB frontend).
- nginx unprivileged (uid 101) con reverse proxy `/api`, CSP, HSTS, source maps
  bloqueados, healthcheck `/healthz`.
- Compose prod con redes aisladas: `backend` con `internal: true` (db + backend),
  `web` (frontend + backend) — la DB físicamente no puede recibir tráfico de fuera.
- Resource limits y reservations en los 3 servicios.
- Logging rotation (10MB × 3 archivos) vía YAML anchor reutilizable.
- Env vars críticas requeridas con `:?` (falla rápido si faltan).
- DB blindada (sin `ports:` al host).
- `.env.production.example` template commiteado.
- Versiones de Node/pnpm pineadas con corepack + `.nvmrc` + `engine-strict`.
- Build cross-platform configurable (`BUILD_PLATFORM`).
- `SESSION_COOKIE_SECURE` desacoplado de `NODE_ENV` para testing local de prod
  sobre HTTP.

---

## 🔴 Bloqueantes — antes de cualquier deploy real

### 1. HTTPS / TLS terminado

Hoy todo es HTTP. Opciones:

- **Cloudflare** en frente (más simple, gratis, incluye DDoS protection).
- **Caddy** o **Traefik** con Let's Encrypt automático.
- **nginx** en el host con certbot.

Una vez con HTTPS:

- `SESSION_COOKIE_SECURE=true` en `.env.production`.
- Considerar `sameSite: 'strict'` en la cookie (revisar `backend/src/app.js`).

### 2. Quitar `ports: 8000` del backend en compose

El reverse proxy `/api` ya funciona. El backend debe estar solo en red interna.
Editar `docker-compose.yml`:

```yaml
backend:
  # eliminar el bloque `ports:` completo
```

### 3. Estrategia de migraciones

Hoy `database/CAISchema.sql` solo corre en first-boot vía
`docker-entrypoint-initdb.d`. Cualquier cambio futuro de schema requiere:

- `prisma migrate dev` en desarrollo para generar migraciones versionadas.
- `prisma migrate deploy` como step previo al rollout (job separado en CI/CD).
- Eliminar el bind mount de `database/` en prod compose una vez que las
  migraciones manejen todo el schema.

### 4. Secrets fuera del filesystem

`.env.production` con passwords en disco es OK para staging, no para prod final.
Migrar a:

- **Docker secrets** (si usas Swarm).
- **Vault**, **AWS Secrets Manager**, **GCP Secret Manager** (cloud).
- **GitHub Actions secrets** (CI/CD).

### 5. Backups de DB

`db_data` es un volumen local sin backup automático.
Mínimo viable:

- Cron job de `mysqldump` → S3/GCS daily.
- Retención 30 días.
- **Test de restore mensual** (un backup sin restore no es un backup).

---

## 🟡 Importantes — antes de tener usuarios reales

### 6. CI/CD pipeline

GitHub Actions que:

1. Corre tests (`pnpm test`).
2. Buildea imágenes con `IMAGE_TAG=$GIT_SHA`.
3. Push a un registry (GHCR, ECR, Docker Hub).
4. Deploya con `docker compose pull && docker compose up -d`.

### 7. DB gestionada

Migrar de container MySQL a RDS / Cloud SQL / PlanetScale:

- Backups automáticos.
- Failover y read replicas.
- Escalabilidad vertical sin downtime.
- Parches de seguridad gestionados.

El container MySQL queda solo para dev/staging.

### 8. Observabilidad

- **Logs centralizados:** Loki, CloudWatch, Datadog.
- **Errores agregados:** Sentry.
- **Métricas básicas:** uptime, p95 latency, error rate.
- **Alertas:** PagerDuty, Slack, email.

### 9. Rate limiting + WAF

Hoy hay `express-rate-limit` en endpoints sensibles. En prod real agregar:

- **Cloudflare WAF** (DDoS, bot protection, rate limits a nivel edge).
- Rate limits por IP a nivel load balancer.

### 10. Logs de auditoría off-site

Los `registro_auditoria` viven en la misma DB. Si un atacante con acceso a la
DB los borra, perdiste la pista. Replicar a un sink inmutable:

- S3 con **object lock** habilitado.
- BigQuery / Snowflake append-only.
- Stream a Datadog/Splunk con retención larga.

---

## 🟢 Polish — cuando puedas

### 11. Recovery / disaster plan

- Runbook escrito por escenario:
  - DB caída.
  - Backend OOM.
  - Rollback de deploy fallido.
  - Restore de backup.
- **RTO** (Recovery Time Objective) y **RPO** (Recovery Point Objective) definidos.

### 12. Email transaccional gestionado

Hoy `nodemailer` con `service: 'gmail'` y app password. Para volumen real:

- **SendGrid** / **Postmark** / **AWS SES** / **Resend**.
- Mejor deliverability (SPF, DKIM, DMARC configurados).
- Sin riesgo de Gmail bloqueando la cuenta por volumen.

### 13. Documentación de operaciones

En `docs/ops/`:

- Cómo deployar.
- Cómo hacer rollback.
- Cómo correr una migración.
- Cómo restaurar un backup.
- Cómo rotar secrets.

### 14. Security review formal

Pentest o auditoría externa antes de manejar datos médicos reales en prod.
Para CAIS (datos de salud + universidad pública), esto debería ser un
requisito explícito de compliance.

---

## Camino sugerido

| Plazo                                    | Tareas                                              |
| ---------------------------------------- | --------------------------------------------------- |
| **Esta semana**                          | 1, 2 (HTTPS + blindar backend). ~1 hora de trabajo. |
| **Antes de demo a usuarios**             | 3, 5, 6 (migraciones + backups + CI). ~2-3 días.    |
| **Antes de prod real con datos médicos** | Todo lo demás + security review.                    |

---

## Comandos de referencia

### Levantar prod local para pruebas

```bash
cp .env.production.example .env.production
# editar SESSION_SECRET, MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD, DATABASE_URL
docker compose --env-file .env.production up -d --build
```

### Seed inicial (DB vacía)

```bash
docker compose --env-file .env.production exec backend node prisma/seed.js
```

### Logs

```bash
docker compose --env-file .env.production logs -f
docker compose --env-file .env.production logs -f backend
```

### Bajar todo (con datos)

```bash
docker compose --env-file .env.production down -v
```

### Acceso a la DB (debugging)

```bash
docker compose --env-file .env.production exec db \
  sh -c 'mysql -u user -p$MYSQL_PASSWORD cais'
```

### Rebuild solo backend

```bash
docker compose --env-file .env.production up -d --build backend
```

### Recrear container (sin rebuild) para tomar env vars nuevas

```bash
docker compose --env-file .env.production up -d --force-recreate backend
```
