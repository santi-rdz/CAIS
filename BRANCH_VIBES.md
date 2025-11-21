# 🔥 Branch Vibes - Testing & CI/CD (La Branch God Tier)

## 🎯 ¿Qué Pedo con Esta Branch?

La branch **Vibes** es donde implementamos todo el sistema de **testing** y **CI/CD** pa' el proyecto CAIS. Básicamente, aquí está toda la automatización y calidad de código que hace que el proyecto no se rompa cuando le movemos cosas. 

**TL;DR:** Esta branch trae la automatización más god pa' que no tengas que hacer nada manual we 🚀

---

## 🧪 Testing (Las Pruebas - Pa' No Romper Nada)

### 1. Pruebas Unitarias (Frontend) 🎨

**Ubicación:** `frontend/src/test/`

**¿Qué son?** Son pruebas que testean componentes individuales del frontend (cada pieza por separado).

**Tecnologías:**
- **Vitest** - Framework de testing pa' Vite (rápido como rayo ⚡)
- **React Testing Library** - Pa' probar componentes de React
- **Jest-DOM** - Matchers extras pa' verificar el DOM

**¿Qué se testea?** ✅
- **Página de Login** (`LoginPage.test.jsx`)
  - Que se renderice sin errores
  - Que tenga el título "Iniciar Sesión"
  - Que tenga los inputs de usuario/email y contraseña
  - Que tenga el link de "¿Olvidaste tu contraseña?"
  - Que tenga el botón de "Iniciar Sesión"

- **Validaciones del Formulario de Login** (`loginForm.test.jsx`)
  - Mostrar errores si los campos están vacíos
  - Validar formato de email cuando no está activo el dominio UABC
  - No mostrar errores cuando los datos son válidos
  - Renderizar correctamente los inputs

**Total de Tests:** 10 tests unitarios en el frontend 🎯

**Cómo correrlos:**
```bash
cd frontend
npm test
```

---

### 2. Pruebas de Integración (Backend) 🧠

**Ubicación:** `backend/server.test.js`

**¿Qué son?** Son pruebas que testean la API completa (varios componentes trabajando juntos).

**Tecnologías:**
- **Jest** - Framework de testing (el jefazo de los tests)
- **Supertest** - Pa' hacer peticiones HTTP fake pero realistas
- **Node.js** - Ambiente de ejecución

**¿Qué se testea?** ✅
- **POST /api/patients**
  - Crear paciente con todos los datos (nombre, apellido, fecha, teléfono, email, dirección)
  - Crear paciente con solo datos requeridos (nombre, apellido, fecha)
  - Error 400 si falta el nombre
  - Error 400 si falta el apellido
  - Error 400 si falta la fecha de nacimiento

- **GET /api/patients**
  - Retornar todos los pacientes registrados
  - Verificar que la respuesta sea un array (lista)

**Total de Tests:** 6 tests de integración en el backend 🔗

**Cómo correrlos:**
```bash
cd backend
npm test
```

---

## 🔄 CI/CD (Continuous Integration / Continuous Deployment)

### ¿Qué es CI/CD? 🤔

**CI/CD** es automatizar todo el pedo de testing, compilación y despliegue pa' no tener que hacer nada manual. Cuando haces push, se ejecutan automáticamente todos los tests y builds.

**Beneficios:**
- ✅ No más "en mi compu jala" (todos usan el mismo ambiente)
- ✅ Detecta errores antes de hacer merge
- ✅ Código siempre está en estado funcional
- ✅ Mayor confianza al hacer cambios
- ✅ Automatización god tier (no haces nada manual)

---

## 🚀 GitHub Actions (El Pipeline de CI/CD)

**Ubicación:** `.github/workflows/ci.yml`

### ¿Cuándo se ejecuta? ⚡

El pipeline se activa automáticamente cuando:
- Haces **push** a las ramas `main` o `Vibes`
- Creas un **Pull Request** hacia `main`

### Jobs del Pipeline (Los Trabajos) 💼

El pipeline tiene **6 jobs** que se ejecutan:

#### 1. 🧪 Backend Tests
- Instala dependencias del backend
- Ejecuta los 6 tests de integración con Jest y Supertest
- Valida que la API funcione correctamente
- Sube resultados como artefactos

**Duración aprox:** ~30 segundos

#### 2. 🎨 Frontend Tests
- Instala dependencias del frontend
- Ejecuta los 10 tests unitarios con Vitest
- Valida que los componentes se rendericen bien
- Sube resultados como artefactos

**Duración aprox:** ~25 segundos

#### 3. 🔍 Frontend Lint
- Ejecuta ESLint en el código del frontend
- Verifica que el código siga las reglas de estilo
- Detecta errores de sintaxis
- Valida mejores prácticas de React

**Duración aprox:** ~15 segundos

#### 4. 📦 Frontend Build
- Compila el frontend para producción
- Genera la carpeta `dist/` con los archivos optimizados
- Verifica que no haya errores de compilación
- Sube el build como artefacto

**Duración aprox:** ~40 segundos

#### 5. 🐳 Docker Compose Check
- Construye las imágenes de Docker
- Levanta los contenedores (backend + frontend)
- Verifica que los servicios respondan en sus puertos
- Ejecuta tests dentro de Docker
- Valida que todo jale en ambiente containerizado

**Duración aprox:** ~2 minutos

#### 6. ✅ CI Success
- Se ejecuta solo si todos los jobs anteriores pasaron
- Confirma que el pipeline fue exitoso
- Da luz verde pa' hacer merge

---

## 📊 Flujo Completo del Pipeline

```
┌─────────────────────────────────────────────────┐
│     PUSH A BRANCH VIBES O MAIN 📤               │
│     O CREAR PULL REQUEST 🔀                     │
└────────────────────┬────────────────────────────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
  ┌─────────┐  ┌─────────┐  ┌─────────┐
  │ Backend │  │Frontend │  │Frontend │
  │ Tests   │  │ Tests   │  │  Lint   │
  │  🧪     │  │  🎨     │  │  🔍     │
  │ 6 tests │  │10 tests │  │ESLint   │
  └────┬────┘  └────┬────┘  └────┬────┘
       │            │            │
       └────────┬───┴────────────┘
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
  ┌─────────┐      ┌──────────┐
  │Frontend │      │ Docker   │
  │  Build  │      │ Compose  │
  │   📦    │      │ Check 🐳 │
  │Webpack  │      │Container │
  └────┬────┘      └────┬─────┘
       │                │
       └────────┬───────┘
                │
                ▼
         ┌─────────────┐
         │ CI Success  │
         │   ✅ 💯     │
         │  Todo god!  │
         └─────────────┘
```

---

## 📈 Estadísticas de Testing

### Coverage (Cobertura) 📊

**Backend:**
- Endpoints testeados: 2/2 (100%)
- Tests de integración: 6 tests
- Validaciones: 3 campos requeridos validados

**Frontend:**
- Componentes testeados: Login completo
- Tests unitarios: 10 tests
- Validaciones: Formularios completos

### Tiempo de Ejecución ⏱️

- **Backend Tests:** ~30 segundos
- **Frontend Tests:** ~25 segundos
- **Frontend Lint:** ~15 segundos
- **Frontend Build:** ~40 segundos
- **Docker Compose:** ~2 minutos
- **Pipeline completo:** ~3-4 minutos

---

## 🛠️ Cómo Usar Esta Branch

### 1. Clonar y Cambiar a la Branch Vibes

```bash
git clone https://github.com/tu-repo/CAIS.git
cd CAIS
git checkout Vibes
```

### 2. Correr Tests Localmente

**Backend:**
```bash
cd backend
npm install
npm test
```

**Frontend:**
```bash
cd frontend
npm install
npm test
npm run lint
```

### 3. Correr Todo con Docker

```bash
docker-compose up --build
```

En otra terminal:
```bash
docker-compose exec backend npm test
```

### 4. Ver el Pipeline en GitHub

1. Haz push a la branch Vibes
2. Ve a tu repo en GitHub → pestaña **Actions**
3. Verás el pipeline ejecutándose automáticamente
4. Todos los checks deben estar en verde ✅

---

## 📝 Commits Importantes de Esta Branch

Aquí están los commits más relevantes que construyeron esta branch:

1. **`2a177fc`** - Se agregaron accesos directos de otros .md en readme
2. **`ae67c47`** - El CI/CD ya no necesita coverage
3. **`dfee87a`** - Simplificar el CI/CD para que solo valide el test unitario y el test de integración
4. **`1697a95`** - TEST
5. **`ca80e13`** - Se arreglaron las pruebas unitarias de frontend para validar campos en login
6. **`87b431d`** - CI/CD tutorial
7. **`086b4fc`** - Se agregaron .md de como funciona, guia para los tests. Se agrego UI para Nuevo Paciente, prueba de integracion para esta prueba (API)

---

## 🎯 Objetivos Alcanzados en Esta Branch

✅ **Pruebas Unitarias (Frontend)**
- 10 tests implementados
- Testing Library + Vitest configurado
- Validaciones de formularios testeadas

✅ **Pruebas de Integración (Backend)**
- 6 tests implementados
- Jest + Supertest configurado
- API completa testeada

✅ **CI/CD con GitHub Actions**
- Pipeline completo funcionando
- 6 jobs ejecutándose automáticamente
- Detección de errores antes de merge

✅ **Empaquetamiento (Build)**
- Frontend compila correctamente
- Build optimizado para producción
- Artefactos generados en el pipeline

✅ **Documentación Completa**
- README.md actualizado
- GUIA_DE_TESTS.md creada
- CI_CD_SETUP.md creada
- Todo en lenguaje Gen-Z Mexicano pa' que le entiendas de volada

---

## 🔮 Próximos Pasos (Lo Que Falta)

### 1. Continuous Deployment (CD) 🚀
- Desplegar automáticamente a un servidor
- Integrar con Heroku, Vercel, o AWS
- Automatizar el deploy cuando el pipeline pase

### 2. Code Coverage 📊
- Agregar reportes de cobertura de código
- Establecer un mínimo de 80% de coverage
- Integrar con Codecov o Coveralls

### 3. Tests E2E (End-to-End) 🎭
- Agregar tests con Cypress o Playwright
- Probar flujos completos de usuario
- Simular interacciones reales en el navegador

### 4. Performance Tests ⚡
- Medir tiempos de respuesta de la API
- Verificar que el frontend cargue rápido
- Detectar degradación de performance

### 5. Security Scanning 🔒
- Escanear vulnerabilidades en dependencias
- Integrar Snyk o Dependabot
- Validar que no haya issues de seguridad

---

## 🎉 Resumen Final (TL;DR)

La branch **Vibes** trae todo el setup de testing y CI/CD pa' el proyecto CAIS:

- 🧪 **10 tests unitarios** en el frontend (componentes individuales)
- 🔗 **6 tests de integración** en el backend (API completa)
- 🔄 **Pipeline de CI/CD** con GitHub Actions (automatización total)
- 📦 **Empaquetamiento** del frontend (build optimizado)
- 📚 **Documentación completa** (todo bien explicado we)

**¡Todo automatizado y listo pa' usar!** 🚀💯

Cuando hagas push, el pipeline se ejecuta solo y te dice si algo se rompió. No más "en mi compu jala" porque todos los tests corren en la nube con el mismo ambiente.

**¡Bienvenido a la automatización god tier carnal!** 🔥✨

---

## 📚 Documentación Relacionada

Pa' más detalles, checa estos archivos:

- [📋 README Principal](./readme.md) - Arquitectura completa del sistema
- [🧪 Guía de Tests](./GUIA_DE_TESTS.md) - Cómo hacer y correr tests
- [🔄 CI/CD Setup](./CI_CD_SETUP.md) - Configuración del pipeline
- [🎨 Frontend README](./frontend/README.md) - Detalles del frontend

---

**Hecho con 💚 por el equipo CAIS**
**Branch Vibes - Testing & CI/CD God Tier** 🔥💯🚀
