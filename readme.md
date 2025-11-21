## 🏗️ La Archi del Sistema (cómo está armado este pedo)

Este sistema está dividido en **3 partes bien perronas** que jalan juntas:

### 1. **Frontend (Lo que ves, la carita bonita)** 🎨✨
- Es lo que se ve en tu navegador, todo lo visual we
- La interfaz con botones, forms y menús más aesthetic
- Armado con **React** (una tecnología que está god tier para hacer interfaces)
- Corre en tu navegador en `http://localhost:5173`

**¿Qué hace este compa?** 💅
- Muestra el dashboard (la página principal más chida)
- Te presenta el formulario pa' registrar pacientes
- Tira notificaciones cuando algo sale bien o cuando la cagas 🚨
- Valida que no te falte nada antes de mandar los datos

### 2. **Backend (El cerebrito del jale)** 🧠🔥
- Es el servidor que procesa toda la info
- No lo ves directamente, pero es el que hace la magia detrás de escena
- Construido con **Node.js** y **Express** (tecnologías que están re piola para hacer servidores)
- Corre en `http://localhost:8000`

**¿Qué hace este morro?** 🤓
- Recibe las peticiones del frontend
- Valida que los datos estén de pelos
- Guarda la info de los pacientes
- Le responde al frontend si todo salió bien o si hubo pedo

### 3. **Base de Datos** 💾📦
- Ahorita los datos se guardan en la **memoria** del servidor (bien precario we)
- Cuando reinicias el server, bye bye data 👋
- En el futuro se va a conectar a **MySQL** pa' guardar todo de forma permanente (ya más formal)

## 🔄 ¿Cómo se Comunican entre Sí? (El chismecito)

El frontend y el backend se hablan mediante **API REST**, que es como un mensajero bien chismoso que lleva la info de un lado pa'l otro 📬💬

### Flujo de Registro de un Paciente:

```
1. Usuario                 →  2. Frontend              →  3. Backend               →  4. Base de Datos
   Llena el formulario        Valida los campos           Procesa y valida         Guarda la información
   y hace clic en             Envía los datos             Crea el registro
   "Registrar"                al backend                  Responde: "¡Éxito!"
                                                                     ↓
                                                          5. Frontend recibe respuesta
                                                             Muestra notificación
                                                             "Paciente registrado"
                                                             Cierra el formulario
```

### Ejemplo Práctico (pa' que le entiendas):

**Paso 1:** Le das clic al botón "+ Nuevo Paciente" 
- El frontend te muestra un formulario re bonito

**Paso 2:** Llenas los datos (nomas no te hagas wey):
- Nombre: Juan
- Apellido: Pérez
- Fecha de Nacimiento: 15/05/1990

**Paso 3:** Le das al "Registrar Paciente" 
- El frontend manda esta info al backend por mensaje privado 📨

**Paso 4:** El backend recibe los datos y checa que estén completos:
- ✅ ¿Tiene nombre? Sí we
- ✅ ¿Tiene apellido? También
- ✅ ¿Tiene fecha de nacimiento? Nel que sí
- ✅ Todo bien, guarda al paciente sin pedos

**Paso 5:** El backend le responde al frontend:
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "fechaNacimiento": "1990-05-15",
  "fechaRegistro": "2025-11-21T00:30:00.000Z"
}
```

**Paso 6:** El frontend recibe la respuesta
- Muestra notificación verde bien aesthetic: "✓ Paciente registrado exitosamente" 💚
- Cierra el formulario solito (magia pura)

## 📡 Los Endpoints (Las Rutas del Chisme)

Los endpoints son como "direcciones de WhatsApp" donde el frontend puede mandar mensajitos:

### 1. Registrar un Paciente
**Ruta:** `POST /api/patients`

**¿Qué hace?** Crea un nuevo paciente en el sistema

**Datos que necesita:**
- nombre (obligatorio)
- apellido (obligatorio)
- fechaNacimiento (obligatorio)
- telefono (opcional)
- email (opcional)
- direccion (opcional)

**Lo que devuelve:**
- Los datos del paciente recién creado con su ID único

### 2. Obtener Todos los Pacientes
**Ruta:** `GET /api/patients`

**¿Qué hace?** Devuelve la lista completa de pacientes registrados

**Lo que devuelve:**
- Un listado con todos los pacientes

## 🔒 Validaciones (Pa' que no la cagues)

El sistema tiene **2 niveles de validación** pa' asegurar que los datos estén de 10:

### Validación en el Frontend: 🛡️
- Los campos con `*` son obligatorios (no seas menso, llénalos)
- No puedes mandar el form si te falta algo
- El email debe tener formato válido (ejemplo@dominio.com) si no, ni te la creas

### Validación en el Backend: 🚨
- Vuelve a checar que nombre, apellido y fecha de nacimiento sí existan
- Si falta alguno, te regresa un error 400 con mensaje tipo:
  ```
  "Nombre, apellido y fecha de nacimiento son requeridos we"
  ```

**¿Por qué 2 validaciones? (doble check pa' los llorones)** 🤔
- La del frontend es pa' que tú no te equivoques (respuesta al instante)
- La del backend es la seguridad real (pa' que ningún hacker mamón se salte las reglas)

## 🎯 Estados del Sistema

Durante el proceso de registro, el sistema pasa por varios estados:

### Estado: Formulario Cerrado
```
Dashboard visible → Botón "+ Nuevo Paciente" disponible
```

### Estado: Formulario Abierto
```
Modal visible → Campos vacíos → Botón "Registrar" activo
```

### Estado: Enviando Datos
```
Campos bloqueados → Botón muestra "Registrando..." → No se puede cerrar
```

### Estado: Éxito
```
Notificación verde → Formulario se cierra → Dashboard visible nuevamente
```

### Estado: Error
```
Notificación roja con mensaje → Formulario sigue abierto → Puedes corregir
```

## 🐳 Docker (La Caja Mágica)

**Docker** es como una "caja mágica" que trae todo lo que necesitas pa' que el sistema jale sin pedos:

- No necesitas instalar Node.js en tu compu (te ahorras el drama)
- No te tienes que preocupar por versiones ni dependencias (todo incluido we)
- Con un solo comando (`docker-compose up`) ya jala todo el pedo 🚀

**¿Qué hace Docker el compa?** 🐳
1. Crea un contenedor pa'l frontend (su casita)
2. Crea un contenedor pa'l backend (otra casita)
3. Los conecta entre sí (como si fueran vecinos)
4. Abre los puertos pa' que puedas entrar desde tu navegador 🌐

## 📊 Flujo Completo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR WEB                            │
│  http://localhost:5173                                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              FRONTEND (React + Vite)                      │  │
│  │                                                            │  │
│  │  • Dashboard con botón "+ Nuevo Paciente"                │  │
│  │  • Formulario de registro (PatientForm)                  │  │
│  │  • Validación de campos                                   │  │
│  │  • Notificaciones (React Hot Toast)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Llamadas API (HTTP)
                            │ fetch("http://localhost:8000/api/patients")
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVIDOR BACKEND                              │
│  http://localhost:8000                                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           BACKEND (Node.js + Express)                     │  │
│  │                                                            │  │
│  │  • POST /api/patients  → Registrar paciente              │  │
│  │  • GET /api/patients   → Listar pacientes                │  │
│  │  • Validaciones de datos                                  │  │
│  │  • Manejo de errores                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         BASE DE DATOS (Memoria por ahora)                 │  │
│  │                                                            │  │
│  │  const patients = [                                        │  │
│  │    { id: 1, nombre: "Juan", apellido: "Pérez", ... }     │  │
│  │  ]                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 ¿Cómo Usar el Sistema? (Tutorial Express)

### Paso 1: Prende el Sistema 🔥
```bash
docker-compose up --build
```
Esto levanta todo el rollo (frontend y backend) de forma automática, no mames qué fácil

### Paso 2: Abre tu Navegador 🌐
Jálale a: `http://localhost:5173/dashboard`

### Paso 3: Registrar un Paciente 📝
1. Dale clic al botón "+ Nuevo Paciente" (el verde que está arriba a la derecha)
2. Llena el formulario (hazlo bien porfa)
3. Dale clic en "Registrar Paciente"
4. Vas a ver una notificación de éxito bien bonita ✨

---

## 📚 Documentación Adicional (Pa' que le sigas)

- [🔥 Branch Vibes - Testing & CI/CD](./BRANCH_VIBES.md) - Todo sobre esta branch (testing, integración y automatización completa)
- [📋 Guía de Tests](./GUIA_DE_TESTS.md) - Aprende a hacer y correr tests (pa' no romper nada)
- [🔄 Configuración CI/CD](./CI_CD_SETUP.md) - Guía de integración continua con GitHub Actions (automatización god tier)
- [🎨 Frontend README](./frontend/README.md) - Detalles del frontend (React + Vite)


