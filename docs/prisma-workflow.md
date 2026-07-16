# Flujo de trabajo con Prisma

`schema.prisma` es la fuente de verdad. La DB se sincroniza con él — no al revés.

---

## Primera vez (clonar el repo)

```bash
pnpm setup
```

Instala dependencias, levanta MySQL, aplica todas las migraciones y corre el seed.

> Requiere `DATABASE_URL=mysql://root:rootpassword@localhost:3307/cais` en tu `.env` local.

---

## Día a día

```bash
pnpm dev
```

El backend aplica las migraciones pendientes automáticamente al arrancar.

---

## Cuando cambias el schema

1. Edita `backend/prisma/schema.prisma`
2. Corre `pnpm prisma:migrate` (te pide un nombre, ej. `add_telefono_paciente`) — genera la migración SQL, la aplica y regenera el cliente automáticamente
3. Commitea `schema.prisma` + la carpeta `backend/prisma/migrations/<timestamp>/`

---

## Cuando un compañero cambió el schema

```bash
git pull
pnpm dev   # la migración se aplica sola
```

---

## Reset total

```bash
pnpm db:fresh
```

Borra el volumen, recrea la DB, aplica todas las migraciones y corre el seed.

---

## Comandos disponibles desde la raíz

| Comando                | Qué hace                                 | Cuándo usarlo                     |
| ---------------------- | ---------------------------------------- | --------------------------------- |
| `pnpm prisma:migrate`  | Crea y aplica una migración nueva        | Después de editar `schema.prisma` |
| `pnpm prisma:deploy`   | Aplica migraciones pendientes            | Manual si no quieres reiniciar    |
| `pnpm prisma:generate` | Regenera el cliente Prisma               | Raramente necesario               |
| `pnpm prisma:studio`   | Abre UI visual de la DB en el navegador  | Debugging / inspección rápida     |
| `pnpm prisma:seed`     | Carga los datos iniciales                | Tras un `db:fresh`                |
| `pnpm db:fresh`        | Reset total: borra DB, migra y hace seed | Cuando quieres empezar de cero    |
