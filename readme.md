## 🏗️ Arquitectura del Sistema

El sistema está dividido en **3 partes principales** que trabajan juntas:

### 1. **Frontend (La parte visual)** 🎨
- Es lo que ves en tu navegador web
- La interfaz con botones, formularios y menús
- Construido con **React** (una tecnología para crear interfaces web modernas)
- Se ejecuta en tu navegador en `http://localhost:5173`

**¿Qué hace?**
- Muestra el dashboard (página principal)
- Presenta el formulario para registrar pacientes
- Muestra notificaciones cuando algo sale bien o mal
- Valida que los campos estén llenos antes de enviar datos

### 2. **Backend (El cerebro del sistema)** 🧠
- Es el servidor que procesa la información
- No lo ves directamente, pero hace todo el trabajo "detrás de escena"
- Construido con **Node.js** y **Express** (tecnologías para crear servidores web)
- Se ejecuta en `http://localhost:8000`

**¿Qué hace?**
- Recibe las solicitudes del frontend
- Valida que los datos sean correctos
- Guarda la información de los pacientes
- Envía respuestas al frontend

### 3. **Base de Datos** 💾
- Actualmente los datos se guardan en la **memoria** del servidor
- Cuando el servidor se reinicia, los datos se pierden
- En el futuro se conectará a **MySQL** para guardar datos permanentemente

## 🔄 ¿Cómo se Comunican entre Sí?

El frontend y el backend se comunican mediante **API REST**, que es como un mensajero que lleva información de un lado a otro.

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

### Ejemplo Práctico:

**Paso 1:** Haces clic en el botón "+ Nuevo Paciente"
- El frontend muestra un formulario

**Paso 2:** Llenas los datos:
- Nombre: Juan
- Apellido: Pérez
- Fecha de Nacimiento: 15/05/1990

**Paso 3:** Haces clic en "Registrar Paciente"
- El frontend envía esta información al backend

**Paso 4:** El backend recibe los datos y verifica:
- ✅ ¿Tiene nombre? Sí
- ✅ ¿Tiene apellido? Sí
- ✅ ¿Tiene fecha de nacimiento? Sí
- ✅ Todo correcto, guarda el paciente

**Paso 5:** El backend responde:
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
- Muestra notificación verde: "✓ Paciente registrado exitosamente"
- Cierra el formulario automáticamente

## 📡 Los Endpoints (Rutas de Comunicación)

Los endpoints son como "direcciones" donde el frontend puede enviar solicitudes:

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

## 🔒 Validaciones

El sistema tiene **2 niveles de validación** para asegurar que los datos sean correctos:

### Validación en el Frontend:
- Los campos marcados con `*` son obligatorios
- No puedes enviar el formulario si faltan datos
- El email debe tener formato válido (ejemplo@dominio.com)

### Validación en el Backend:
- Verifica nuevamente que nombre, apellido y fecha de nacimiento existan
- Si falta alguno, devuelve error 400 con mensaje:
  ```
  "Nombre, apellido y fecha de nacimiento son requeridos"
  ```

**¿Por qué 2 validaciones?**
- La del frontend mejora la experiencia del usuario (respuesta inmediata)
- La del backend es la seguridad real (nadie puede saltarse las reglas)

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

## 🐳 Docker (El Contenedor)

**Docker** es como una "caja mágica" que contiene todo lo necesario para que el sistema funcione:

- No necesitas instalar Node.js en tu computadora
- No te preocupas por versiones o dependencias
- Con un solo comando (`docker-compose up`) todo funciona

**¿Qué hace Docker?**
1. Crea un contenedor para el frontend
2. Crea un contenedor para el backend
3. Los conecta entre sí
4. Expone los puertos para que puedas acceder desde tu navegador

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

## 🚀 ¿Cómo Usar el Sistema?

### Paso 1: Iniciar el Sistema
```bash
docker-compose up --build
```
Esto levanta frontend y backend automáticamente

### Paso 2: Abrir el Navegador
Ve a: `http://localhost:5173/dashboard`

### Paso 3: Registrar un Paciente
1. Haz clic en "+ Nuevo Paciente" (botón verde arriba a la derecha)
2. Completa el formulario
3. Haz clic en "Registrar Paciente"
4. Verás una notificación de éxito

### Paso 4: Verificar que Funcionó
Puedes revisar la consola del navegador (F12) para ver el paciente registrado

## ❓ Preguntas Frecuentes

**P: ¿Por qué se pierden los datos al reiniciar?**
R: Porque actualmente se guardan en memoria. Próximamente se conectará a MySQL.

**P: ¿Puedo acceder desde otra computadora?**
R: No directamente. Por ahora solo funciona en `localhost` (tu computadora).

**P: ¿Qué pasa si el backend no está funcionando?**
R: El frontend mostrará un error al intentar registrar un paciente.

**P: ¿Los datos son seguros?**
R: Este es un ambiente de desarrollo. Para producción se necesitarían más medidas de seguridad.

