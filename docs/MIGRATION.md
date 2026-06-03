# Migración a pnpm

`main` ahora usa **pnpm + Docker**. Si tu rama tiene commits propios, sigue estos pasos.

> Si no tienes commits propios: `git checkout main && git pull` y salta al paso 3.

## 1. Rebasar sobre `main`

```bash
git stash push -u -m "wip"        # solo si tienes cambios sin commitear
rm -rf node_modules **/node_modules package-lock.json
git fetch origin
git rebase origin/main
```

### Si para con conflicto en `pnpm-lock.yaml`

Quédate con la versión de `main` y continúa:

```bash
git checkout --theirs pnpm-lock.yaml
git add pnpm-lock.yaml
git rebase --continue
```

Si hay conflicto en `package.json`, resuelve a mano y luego:

```bash
corepack enable
pnpm install
git add pnpm-lock.yaml package.json
git rebase --continue
```

## 2. Recuperar lo guardado

```bash
git stash pop                     # solo si hiciste stash
```

## 3. Instalar y levantar

```bash
corepack enable                   # una vez por máquina
pnpm install                      # local (tu editor lo necesita)
pnpm run fresh                    # rebuild + up + seed
```

## 4. Validar

```bash
docker compose ps                 # los 3 servicios en "(healthy)"
curl http://localhost:8000/health # {"status":"ok"}
```

Frontend: <http://localhost:5173>

Verificar seed:

```bash
pnpm sql
# > USE cais;
# > SELECT COUNT(*) FROM usuarios;   -- esperado: 6
```

---

**Notas**

- `pnpm run fresh` borra la DB. Respalda si tienes datos.
- No uses `npm` ni `yarn` aquí — están bloqueados.
- Primera vez tarda varios minutos (rebuild de imágenes).
- VSCode no resuelve imports: `Cmd+Shift+P` → "Restart TS Server".

**Si el rebase explota**

```bash
git rebase --abort
git branch backup-mi-rama
git reset --hard origin/main
git cherry-pick <hash>            # tus commits buenos uno por uno
```
