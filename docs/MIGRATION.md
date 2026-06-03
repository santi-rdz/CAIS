# Migración a pnpm — actualizar tu rama de trabajo

La rama `main` migró de npm a pnpm + Docker mejorado. Si tienes commits propios
en tu rama, sigue estos pasos para rebasar sobre `main` sin perder tu trabajo.

> Si **no tienes** commits propios, simplemente borra tu rama, haz `git checkout
main && git pull` y salta al paso 4.

## Antes de empezar

```bash
git status                  # ¿tienes cambios sin commitear?
git log --oneline -5        # confirma tus commits propios
```

## 1. Guarda lo no commiteado (si hay)

```bash
git stash push -u -m "WIP pre-pnpm"
```

## 2. Limpia artefactos de npm

```bash
rm -rf node_modules **/node_modules package-lock.json
```

## 3. Trae main y rebasa tu rama encima

```bash
git fetch origin
git rebase origin/main
```

### Si el rebase para con conflicto en `pnpm-lock.yaml`

Quédate siempre con la versión de `main`, luego regenera:

```bash
git checkout --theirs pnpm-lock.yaml
git add pnpm-lock.yaml
git rebase --continue
```

Si hay conflicto también en `package.json`, resuelve manual y al final:

```bash
corepack enable
pnpm install                 # regenera lockfile con tus deps
git add pnpm-lock.yaml package.json
git rebase --continue        # solo si quedaba algún paso
```

## 4. Después del rebase

```bash
git stash pop                # solo si hiciste stash en el paso 1
corepack enable              # activa pnpm vía Corepack
pnpm install                 # install LOCAL: necesario para tu editor (ESLint, autocomplete, types)
pnpm run fresh               # reset total de Docker: rebuild + up + seed
```

## 5. Validar que todo quedó bien

```bash
docker compose ps                           # los 3 servicios en "(healthy)"
curl http://localhost:8000/health           # debe responder {"status":"ok"}
```

Y abrir [http://localhost:5173](http://localhost:5173) en el navegador.

Para verificar el seed:

```bash
pnpm sql
# password: user
mysql> USE cais;
mysql> SELECT COUNT(*) FROM usuarios;   # debe regresar 6
```

## Notas importantes

- `pnpm run fresh` **borra la DB**. Si tienes datos locales que te importan,
  respáldalos primero.
- **NO uses `npm install` ni `yarn`** en este repo — el `preinstall` está
  configurado para bloquearlos.
- `corepack enable` se corre una sola vez por máquina. No se deshace al cambiar
  de rama.
- El primer `pnpm run fresh` tarda varios minutos porque rebuildea las imágenes
  desde cero (descarga pnpm dentro de cada imagen).
- Si VSCode no resuelve imports después del install: `Cmd+Shift+P` → "TypeScript:
  Restart TS Server".

## Si el rebase está siendo una pesadilla

Si tienes demasiados conflictos y prefieres rendirte limpiamente:

```bash
git rebase --abort
git branch backup-mi-rama        # backup por si acaso
git reset --hard origin/main
# Vuelve a aplicar tu trabajo a mano, o cherry-pick los commits buenos:
git cherry-pick <hash>
```
