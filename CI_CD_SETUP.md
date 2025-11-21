# Configuración de CI/CD con GitHub Actions

## 🚀 ¿Qué es CI/CD?

**CI/CD** significa "Continuous Integration / Continuous Deployment" (Integración Continua / Despliegue Continuo).

Es un proceso automatizado que:
- ✅ Ejecuta tests automáticamente cuando haces push
- ✅ Verifica que el código funcione correctamente
- ✅ Compila y empaqueta la aplicación
- ✅ Detecta errores antes de llegar a producción

## 📁 Archivos de GitHub Actions

Los workflows de GitHub Actions están en:
```
.github/workflows/
├── ci.yml              # Pipeline principal de CI/CD
└── deploy-docs.yml     # Verificación de documentación
```

## 🔄 Pipeline Principal (ci.yml)

### Triggers (¿Cuándo se ejecuta?)

El pipeline se ejecuta automáticamente cuando:
- Haces `push` a las ramas `main` o `Vibes`
- Creas un Pull Request hacia `main`

### Jobs (Trabajos que se ejecutan)

#### 1. **Backend Tests** 🧪
```yaml
- Instala dependencias del backend
- Ejecuta tests con Jest y Supertest
- Sube resultados de tests como artefactos
```

**¿Qué verifica?**
- ✅ Tests de la API de pacientes (6 tests)
- ✅ Validaciones de campos
- ✅ Endpoints funcionando correctamente

#### 2. **Frontend Tests** 🎨
```yaml
- Instala dependencias del frontend
- Ejecuta tests con Vitest
- Sube resultados de tests como artefactos
```

**¿Qué verifica?**
- ✅ Tests de la página de login (10 tests)
- ✅ Validación de formularios
- ✅ Renderizado de componentes

#### 3. **Frontend Lint** 🔍
```yaml
- Verifica calidad del código
- Ejecuta ESLint
- Detecta errores de sintaxis y estilo
```

**¿Qué verifica?**
- ✅ Código sigue las reglas de estilo
- ✅ No hay errores de sintaxis
- ✅ Mejores prácticas de React

#### 4. **Frontend Build** 📦
```yaml
- Compila el frontend para producción
- Verifica que no haya errores de compilación
- Sube el build como artefacto
```

**¿Qué verifica?**
- ✅ El código se puede compilar
- ✅ No hay dependencias rotas
- ✅ Está listo para desplegar

#### 5. **Docker Compose Check** 🐳
```yaml
- Construye las imágenes de Docker
- Levanta los contenedores
- Verifica que los servicios funcionen
- Ejecuta tests dentro de Docker
```

**¿Qué verifica?**
- ✅ Docker Compose funciona correctamente
- ✅ Backend responde en puerto 8000
- ✅ Frontend responde en puerto 5173
- ✅ Tests pasan dentro de contenedores

#### 6. **CI Success** ✅
```yaml
- Se ejecuta solo si todos los jobs anteriores pasaron
- Confirma que el pipeline fue exitoso
```

## 📊 Visualización del Pipeline

```
┌─────────────────────────────────────────────────────────┐
│                    PUSH o PULL REQUEST                   │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐  ┌─────────┐  ┌─────────┐
   │Backend │  │Frontend │  │Frontend │
   │ Tests  │  │ Tests   │  │  Lint   │
   └────┬───┘  └────┬────┘  └────┬────┘
        │           │            │
        └───────┬───┴────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
   ┌─────────┐    ┌──────────┐
   │Frontend │    │ Docker   │
   │  Build  │    │ Compose  │
   └────┬────┘    └────┬─────┘
        │              │
        └──────┬───────┘
               │
               ▼
        ┌─────────────┐
        │ CI Success  │
        │      ✅      │
        └─────────────┘
```

## 🎯 ¿Cómo Ver el Estado del Pipeline?

### 1. En GitHub
Ve a tu repositorio → pestaña **"Actions"**

Ahí verás:
- ✅ Workflows exitosos (verde)
- ❌ Workflows fallidos (rojo)
- 🟡 Workflows en progreso (amarillo)

### 2. En tu Pull Request
Cuando creas un PR, verás checks en la parte inferior:
```
✅ Backend Tests - passed
✅ Frontend Tests - passed
✅ Frontend Lint - passed
✅ Frontend Build - passed
✅ Docker Compose Check - passed
```

### 3. Badge en el README (opcional)
Puedes agregar un badge al README.md:
```markdown
![CI](https://github.com/santi-rdz/CAIS/actions/workflows/ci.yml/badge.svg)
```

## 🔧 Configuración Personalizada

### Variables de Entorno
Si necesitas agregar variables de entorno (como API keys), usa GitHub Secrets:

1. Ve a `Settings` → `Secrets and variables` → `Actions`
2. Crea un nuevo secret
3. Úsalo en el workflow:
```yaml
env:
  MY_SECRET: ${{ secrets.MY_SECRET }}
```

### Cambiar Node.js Version
Si necesitas otra versión de Node.js:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'  # Cambiar a la versión deseada
```

## 📝 Logs y Debugging

### Ver logs de un job fallido:
1. Ve a la pestaña **Actions**
2. Haz clic en el workflow fallido
3. Haz clic en el job que falló
4. Expande los pasos para ver detalles

### Ejemplo de error común:
```
Error: Cannot find module 'express'
```
**Solución:** Asegúrate de que las dependencias estén en `package.json`

## 🚦 Estados del Pipeline

| Estado | Significado | Acción |
|--------|-------------|--------|
| ✅ Success | Todos los tests pasaron | Puedes hacer merge |
| ❌ Failed | Algún test falló | Revisa los logs y corrige |
| 🟡 Pending | Pipeline en ejecución | Espera a que termine |
| ⚪ Skipped | Job se saltó (depende de otro) | Normal |

## 🎨 Personalizar el Pipeline

### Agregar más tests:
```yaml
- name: Run integration tests
  run: npm run test:integration
```

### Agregar code coverage:
```yaml
- name: Generate coverage
  run: npm test -- --coverage
  
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
```

### Agregar notificaciones (Slack, Discord):
```yaml
- name: Notify on Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔐 Mejores Prácticas

1. **Ejecuta tests localmente antes de push**
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

2. **Mantén los workflows rápidos**
   - Usa cache para dependencias
   - Paraleliza jobs independientes

3. **No comitees secretos**
   - Usa GitHub Secrets
   - No pongas passwords en el código

4. **Revisa los logs si falla**
   - GitHub Actions te muestra exactamente qué falló

5. **Mantén las dependencias actualizadas**
   ```bash
   npm update
   ```

## 📚 Comandos Útiles

### Ejecutar tests localmente (simular CI):
```bash
# Backend
cd backend
npm ci
npm test

# Frontend
cd frontend
npm ci
npm test
npm run lint
npm run build
```

### Verificar Docker Compose:
```bash
docker-compose build
docker-compose up -d
docker-compose exec backend npm test
docker-compose down
```

## 🐛 Troubleshooting

### Problema: "npm ci" falla
**Solución:** 
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: update package-lock.json"
```

### Problema: Tests pasan localmente pero fallan en CI
**Posibles causas:**
- Diferencias en versión de Node.js
- Variables de entorno faltantes
- Timeouts muy cortos

### Problema: Docker Compose no inicia
**Verificar:**
- Puerto 8000 y 5173 disponibles
- Imágenes se construyen correctamente
- Logs de los contenedores

## 🎯 Próximos Pasos

1. **CD (Continuous Deployment)**
   - Desplegar automáticamente a un servidor
   - Usar Heroku, Vercel, AWS, etc.

2. **Code Coverage**
   - Agregar reportes de cobertura
   - Establecer un mínimo de cobertura (ej: 80%)

3. **E2E Tests**
   - Agregar tests end-to-end con Cypress o Playwright
   - Probar flujos completos del usuario

4. **Performance Tests**
   - Verificar que la app sea rápida
   - Detectar degradación de performance

5. **Security Scanning**
   - Escanear vulnerabilidades
   - Usar herramientas como Snyk o Dependabot

## 📞 Recursos

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Workflow Syntax**: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Marketplace**: https://github.com/marketplace?type=actions

## ✨ Resumen

Con GitHub Actions configurado:
- ✅ Tests se ejecutan automáticamente
- ✅ Detectas errores antes de hacer merge
- ✅ Código siempre está en estado funcional
- ✅ Mayor confianza al hacer cambios

**¡El pipeline está listo!** 🚀 En el próximo push verás GitHub Actions en acción.
