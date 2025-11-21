# 🚀 Configuración de CI/CD con GitHub Actions (Automatización God Tier)

## 🔥 ¿Qué es CI/CD? (El Santo Grial de la Automatización)

**CI/CD** significa "Continuous Integration / Continuous Deployment" (Integración Continua / Despliegue Continuo). Básicamente es automatizar todo el pedo pa' no hacer nada manual.

Es un proceso automatizado que hace magia: ✨
- ✅ Ejecuta tests automáticamente cuando haces push (no más "en mi compu jala")
- ✅ Verifica que el código funcione correctamente (quality control we)
- ✅ Compila y empaqueta la aplicación (build automático, está god)
- ✅ Detecta errores antes de llegar a producción (salva tu vida carnal)

## 📁 Archivos de GitHub Actions (Dónde vive la magia)

Los workflows de GitHub Actions están aquí (apúntatelo): 📂
```
.github/workflows/
├── ci.yml              # Pipeline principal de CI/CD (el jefazo)
└── deploy-docs.yml     # Verificación de documentación (pa' que no subas pura basura)
```

## 🔄 Pipeline Principal (ci.yml) - El Que Manda

### Triggers (¿Cuándo se ejecuta este pedo?) ⚡

El pipeline se ejecuta automáticamente cuando (sin que hagas nada):
- Haces `push` a las ramas `main` o `Vibes` 📤
- Creas un Pull Request hacia `main` (quieres mergear we)

### Jobs (Los Trabajitos que Jalan en Paralelo) 🏃‍♂️

#### 1. **Backend Tests** 🧪 (Pruebas de Integración)
```yaml
- Instala dependencias del backend (npm install pero en la nube)
- Ejecuta tests con Jest y Supertest (las pruebas de integración)
- Sube resultados de tests como artefactos (pa' revisarlos después)
```

**¿Qué verifica este compa?** ✅
- ✅ Tests de la API de pacientes (6 tests - los de crear, validar, etc)
- ✅ Validaciones de campos (que no se cuelen datos inválidos)
- ✅ Endpoints funcionando correctamente (que las rutas sí jalen)

#### 2. **Frontend Tests** 🎨 (Pruebas Unitarias)
```yaml
- Instala dependencias del frontend (npm install del front)
- Ejecuta tests con Vitest (el framework de testing pa' Vite)
- Sube resultados de tests como artefactos
```

**¿Qué verifica este morro?** ✅
- ✅ Tests de la página de login (10 tests - formularios, validaciones)
- ✅ Validación de formularios (que no dejen pasar datos mal)
- ✅ Renderizado de componentes (que se vean bien las cosas)

#### 3. **Frontend Lint** 🔍 (Control de Calidad del Código)
```yaml
- Verifica calidad del código (que no esté todo culero)
- Ejecuta ESLint (el policía del código)
- Detecta errores de sintaxis y estilo (pa' que escribas bonito)
```

**¿Qué verifica este bato?** ✅
- ✅ Código sigue las reglas de estilo (nada de código feo)
- ✅ No hay errores de sintaxis (que compile we)
- ✅ Mejores prácticas de React (pa' que no hagas cochinadas)

#### 4. **Frontend Build** 📦 (Empaquetar Todo)
```yaml
- Compila el frontend para producción (lo hace chiquito y rápido)
- Verifica que no haya errores de compilación (que sí compile)
- Sube el build como artefacto (el paquete final listo pa' deploy)
```

**¿Qué verifica este carnalito?** ✅
- ✅ El código se puede compilar (no truena al buildearlo)
- ✅ No hay dependencias rotas (todas las librerías están bien)
- ✅ Está listo para desplegar (producción ready we)

#### 5. **Docker Compose Check** 🐳 (La Prueba Final)
```yaml
- Construye las imágenes de Docker (crea los containers)
- Levanta los contenedores (prende todo el sistema)
- Verifica que los servicios funcionen (que responda)
- Ejecuta tests dentro de Docker (pruebas en ambiente real)
```

**¿Qué verifica este vato?** ✅
- ✅ Docker Compose funciona correctamente (todo el stack levanta)
- ✅ Backend responde en puerto 8000 (el API está viva)
- ✅ Frontend responde en puerto 5173 (la interfaz está arriba)
- ✅ Tests pasan dentro de contenedores (todo jala en Docker también)

#### 6. **CI Success** ✅ (La Confirmación Final)
```yaml
- Se ejecuta solo si todos los jobs anteriores pasaron
- Confirma que el pipeline fue exitoso (todo god carnal)
```

## 📊 Visualización del Pipeline (Pa' que le entiendas al flujo)

```
┌─────────────────────────────────────────────────────────┐
│          PUSH o PULL REQUEST (Se activó la magia) 🚀     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   ┌────────┐  ┌─────────┐  ┌─────────┐
   │Backend │  │Frontend │  │Frontend │
   │ Tests  │  │ Tests   │  │  Lint   │
   │  🧪    │  │  🎨     │  │  🔍     │
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
   │   📦    │    │   🐳     │
   └────┬────┘    └────┬─────┘
        │              │
        └──────┬───────┘
               │
               ▼
        ┌─────────────┐
        │ CI Success  │
        │   ✅ 💯     │
        │  (Todo god) │
        └─────────────┘
```

## 🎯 ¿Cómo Ver el Estado del Pipeline? (Pa' que chuequees qué onda)

### 1. En GitHub 📂
Jálale a tu repo → pestaña **"Actions"**

Ahí verás todo el jale:
- ✅ Workflows exitosos (verde - todo bien carnal)
- ❌ Workflows fallidos (rojo - algo se rompió we)
- 🟡 Workflows en progreso (amarillo - espérate un toque)

### 2. En tu Pull Request 📝
Cuando creas un PR, verás los checks en la parte de abajo (los semaforitos):
```
✅ Backend Tests - passed (pruebas de integración pasaron)
✅ Frontend Tests - passed (pruebas unitarias pasaron)
✅ Frontend Lint - passed (código está limpio)
✅ Frontend Build - passed (se compiló sin pedos)
✅ Docker Compose Check - passed (Docker jala bien)
```

### 3. Badge en el README (opcional pero se ve god) 🏅
Puedes agregar un badge aesthetic al README.md pa' presumir:
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

## 🚦 Estados del Pipeline (Los Semaforitos)

| Estado | Significado | Acción |
|--------|-------------|--------|
| ✅ Success | Todos los tests pasaron | Puedes hacer merge sin miedo we |
| ❌ Failed | Algún test falló | Revisa los logs y arréglalo carnal |
| 🟡 Pending | Pipeline en ejecución | Espera un toque que termine |
| ⚪ Skipped | Job se saltó (depende de otro) | Normal, no pasa nada |

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

## 🔐 Mejores Prácticas (Pa' no cagarla)

1. **Ejecuta tests localmente antes de hacer push** (no seas mamón)
   ```bash
   cd backend && npm test
   cd frontend && npm test
   ```

2. **Mantén los workflows rápidos** (nadie quiere esperar años)
   - Usa cache para dependencias (pa' no reinstalar todo siempre)
   - Paraleliza jobs independientes (que corran al mismo tiempo)

3. **No comitees secretos** (no seas pendejo we)
   - Usa GitHub Secrets (pa' las API keys y passwords)
   - No pongas passwords en el código (de verdad no lo hagas)

4. **Revisa los logs si falla** (ahí está la respuesta carnal)
   - GitHub Actions te muestra exactamente qué falló

5. **Mantén las dependencias actualizadas** (no uses cosas viejitas)
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

## 🎯 Próximos Pasos (Lo que Falta en Esta Branch)

1. **CD (Continuous Deployment)** 🚀
   - Desplegar automáticamente a un servidor (que se suba solo)
   - Usar Heroku, Vercel, AWS, etc. (las nubes más god)

2. **Code Coverage** 📊
   - Agregar reportes de cobertura (qué % del código está testeado)
   - Establecer un mínimo de cobertura (ej: 80% - pa' no andar con mamadas)

3. **E2E Tests** 🎭
   - Agregar tests end-to-end con Cypress o Playwright
   - Probar flujos completos del usuario (como si fuera una persona real)

4. **Performance Tests** ⚡
   - Verificar que la app sea rápida (nadie quiere apps lentas)
   - Detectar degradación de performance (que no se ponga lenta con el tiempo)

5. **Security Scanning** 🔒
   - Escanear vulnerabilidades (que no haya huecos de seguridad)
   - Usar herramientas como Snyk o Dependabot (detectan cosas peligrosas)

## 📞 Recursos (Links Útiles Pa' Aprender Más)

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Workflow Syntax**: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Marketplace**: https://github.com/marketplace?type=actions

## ✨ Resumen (TL;DR pa' los flojos)

Con GitHub Actions configurado en la branch **Vibes**: 🔥
- ✅ Tests se ejecutan automáticamente (pruebas unitarias + integración)
- ✅ Detectas errores antes de hacer merge (quality control god)
- ✅ Código siempre está en estado funcional (no rompes nada)
- ✅ Mayor confianza al hacer cambios (haces push sin miedo we)

**¡El pipeline está listo papá!** 🚀💯 En el próximo push verás GitHub Actions en acción (automatización nivel god).

---

## 🎉 Sobre Esta Branch (Vibes)

Esta branch **Vibes** tiene todo el setup de:
- 🧪 **Tests Unitarios** (Frontend con Vitest - componentes individuales)
- 🔗 **Tests de Integración** (Backend con Jest + Supertest - API completa)
- 📦 **Empaquetamiento** (Build del frontend listo pa' producción)
- 🔄 **CI/CD con GitHub Actions** (automatización completa we)

Todo está documentado en los .md con lenguaje Gen-Z Mexicano pa' que le entiendas de volada. ¡No hay pretexto pa' no saber qué onda! 💪🔥
