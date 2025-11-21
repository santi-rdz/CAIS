# Guía Completa de Tests del Sistema CAIS

## 📋 Índice

1. [¿Qué son los Tests?](#qué-son-los-tests)
2. [Tests del Backend (API)](#tests-del-backend-api)
3. [Tests del Frontend (Login)](#tests-del-frontend-login)
4. [¿Cómo Ejecutar los Tests?](#cómo-ejecutar-los-tests)
5. [Interpretando los Resultados](#interpretando-los-resultados)

---

### Tipos de Tests en CAIS

1. **Tests de Integración (Backend)**: Prueban que la API funcione correctamente
2. **Tests Unitarios (Frontend)**: Prueban componentes individuales de la interfaz

---

## 🔧 Tests del Backend (API)

### Ubicación
```
backend/server.test.js
```

### Tecnologías Utilizadas

- **Jest**: Framework de testing (el motor que ejecuta los tests)
- **Supertest**: Librería para probar APIs HTTP
- **Node.js**: Ambiente de ejecución

### Estructura del Archivo de Tests

```javascript
describe('API de Pacientes', () => {
  // Grupo de tests relacionados con la API de pacientes
  
  describe('POST /api/patients', () => {
    // Tests específicos para crear pacientes
    
    it('debe crear un nuevo paciente con todos los datos', async () => {
      // Un test individual
    });
  });
});
```

**Elementos clave:**
- `describe()`: Agrupa tests relacionados
- `it()`: Define un test individual
- `expect()`: Verifica que algo sea verdadero

---

## 📝 Tests de Registro de Pacientes (6 tests)

### Test 1: Crear Paciente con Todos los Datos

```javascript
it('debe crear un nuevo paciente con todos los datos', async () => {
  const newPatient = {
    nombre: 'Juan',
    apellido: 'Pérez',
    fechaNacimiento: '1990-05-15',
    telefono: '1234567890',
    email: 'juan.perez@example.com',
    direccion: 'Calle Principal 123'
  };

  const response = await request(server)
    .post('/api/patients')
    .send(newPatient)
    .expect('Content-Type', /json/)
    .expect(201);

  expect(response.body).toMatchObject({
    id: expect.any(Number),
    nombre: 'Juan',
    apellido: 'Pérez',
    // ... resto de campos
  });
});
```

**¿Qué hace este test?**

1. **Prepara datos completos** de un paciente
2. **Envía una petición POST** al endpoint `/api/patients`
3. **Verifica** que:
   - La respuesta sea JSON
   - El código de estado sea 201 (Created)
   - Los datos del paciente se guardaron correctamente
   - Se asignó un ID automáticamente

**¿Por qué es importante?**
- Asegura que cuando un usuario llena TODO el formulario, el sistema funcione correctamente

---

### Test 2: Crear Paciente con Solo Datos Requeridos

```javascript
it('debe crear un paciente con solo datos requeridos', async () => {
  const newPatient = {
    nombre: 'María',
    apellido: 'González',
    fechaNacimiento: '1985-08-20'
  };

  const response = await request(server)
    .post('/api/patients')
    .send(newPatient)
    .expect(201);

  expect(response.body).toMatchObject({
    id: expect.any(Number),
    nombre: 'María',
    apellido: 'González',
    fechaNacimiento: '1985-08-20',
    telefono: '',
    email: '',
    direccion: ''
  });
});
```

**¿Qué hace este test?**

1. **Envía solo los campos obligatorios**: nombre, apellido, fecha de nacimiento
2. **Verifica** que:
   - El paciente se crea exitosamente
   - Los campos opcionales se llenan con valores vacíos

**¿Por qué es importante?**
- Algunos usuarios pueden no tener teléfono, email o dirección
- El sistema debe funcionar sin estos campos

---

### Test 3: Error si Falta el Nombre

```javascript
it('debe retornar error 400 si falta el nombre', async () => {
  const invalidPatient = {
    apellido: 'López',
    fechaNacimiento: '1995-03-10'
  };

  const response = await request(server)
    .post('/api/patients')
    .send(invalidPatient)
    .expect(400);

  expect(response.body).toHaveProperty('error');
});
```

**¿Qué hace este test?**

1. **Intenta crear un paciente SIN nombre**
2. **Verifica** que:
   - El servidor rechaza la petición
   - Devuelve código 400 (Bad Request)
   - Incluye un mensaje de error

**¿Por qué es importante?**
- El nombre es obligatorio
- El sistema debe prevenir registros incompletos

---

### Test 4: Error si Falta el Apellido

```javascript
it('debe retornar error 400 si falta el apellido', async () => {
  const invalidPatient = {
    nombre: 'Carlos',
    fechaNacimiento: '1988-11-25'
  };

  const response = await request(server)
    .post('/api/patients')
    .send(invalidPatient)
    .expect(400);

  expect(response.body).toHaveProperty('error');
});
```

**¿Qué hace este test?**
- Similar al Test 3, pero verifica que el apellido sea obligatorio

---

### Test 5: Error si Falta la Fecha de Nacimiento

```javascript
it('debe retornar error 400 si falta la fecha de nacimiento', async () => {
  const invalidPatient = {
    nombre: 'Ana',
    apellido: 'Martínez'
  };

  const response = await request(server)
    .post('/api/patients')
    .send(invalidPatient)
    .expect(400);

  expect(response.body).toHaveProperty('error');
});
```

**¿Qué hace este test?**
- Verifica que la fecha de nacimiento sea obligatoria

---

### Test 6: Obtener Lista de Pacientes

```javascript
describe('GET /api/patients', () => {
  it('debe retornar todos los pacientes', async () => {
    const response = await request(server)
      .get('/api/patients')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

**¿Qué hace este test?**

1. **Hace una petición GET** al endpoint `/api/patients`
2. **Verifica** que:
   - La respuesta sea JSON
   - El código sea 200 (OK)
   - La respuesta sea un array (lista)

**¿Por qué es importante?**
- Asegura que podemos obtener la lista de todos los pacientes registrados

---

## 🎨 Tests del Frontend (Login)

### Ubicación
```
frontend/src/test/loginForm.test.jsx
frontend/src/test/LoginPage.test.jsx
```

### Tecnologías Utilizadas

- **Vitest**: Framework de testing para Vite
- **React Testing Library**: Herramientas para probar componentes de React
- **Jest-DOM**: Matchers adicionales para verificar el DOM

---

## 🔐 Tests de la Página de Login (6 tests)

### Archivo: `LoginPage.test.jsx`

Estos tests verifican que la página de login **se renderice correctamente**.

### Test 1: Renderizar la Página

```javascript
it("should render page login", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );
});
```

**¿Qué hace?**
- Verifica que la página se pueda cargar sin errores

---

### Test 2: Renderizar Título

```javascript
it("should render title", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );

  expect(screen.getByRole("heading", { name: /iniciar sesión/i }));
});
```

**¿Qué hace?**
- Busca un encabezado con el texto "Iniciar Sesión"
- Verifica que el título esté presente en la página

---

### Test 3: Renderizar Input de Email/Usuario

```javascript
it("should render email input", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );

  expect(screen.getByLabelText(/usuario|correo electronico/i));
});
```

**¿Qué hace?**
- Busca un campo de entrada etiquetado como "Usuario" o "Correo Electrónico"
- Verifica que el input exista

---

### Test 4: Renderizar Input de Contraseña

```javascript
it("should render password input", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );

  expect(screen.getByLabelText(/contraseña/i));
});
```

**¿Qué hace?**
- Verifica que exista un campo para la contraseña

---

### Test 5: Renderizar Link de "Olvidaste tu Contraseña"

```javascript
it("should render forgot password link", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );

  expect(screen.getByRole("link", { name: /¿Olvidaste tu contraseña?/i }));
});
```

**¿Qué hace?**
- Verifica que exista un enlace para recuperar contraseña

---

### Test 6: Renderizar Botón de Login

```javascript
it("should render login button", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );

  expect(screen.getByRole("button", { name: "Iniciar Sesión" }));
});
```

**¿Qué hace?**
- Verifica que exista el botón para iniciar sesión

---

## ✅ Tests de Validación del Formulario de Login (4 tests)

### Archivo: `loginForm.test.jsx`

Estos tests verifican que las **validaciones del formulario funcionen**.

### Test 1: Mostrar Errores si los Campos Están Vacíos

```javascript
it("should show errors if fields are empty", () => {
  renderWithRouter(<Login />);
  const form = screen.getByRole("form");
  fireEvent.submit(form);

  expect(screen.getByText(/ingresa tu usuario|Ingresa tu correo electronico/i));
  expect(screen.getByText(/ingresa tu contraseña/i));
});
```

**¿Qué hace?**

1. **Renderiza el formulario**
2. **Envía el formulario vacío** (simula clic en "Iniciar Sesión" sin llenar nada)
3. **Verifica** que aparezcan mensajes de error

**¿Por qué es importante?**
- Previene que usuarios envíen formularios vacíos
- Mejora la experiencia del usuario con mensajes claros

---

### Test 2: Error si el Email es Inválido (Sin Dominio UABC)

```javascript
it("Should show an error if email format is invalid when no UABC domain is active", () => {
  renderWithRouter(<Login />);

  const toggle = screen.getByTestId("toggle-domain");
  fireEvent.click(toggle); // Cambia a modo email (no UABC)

  const emailInput = screen.getByLabelText(/correo/i);
  const passInput = screen.getByLabelText(/contraseña/i);

  fireEvent.change(emailInput, { target: { value: "invalidemail" } });
  fireEvent.change(passInput, { target: { value: "123456" } });

  const form = screen.getByRole("form");
  fireEvent.submit(form);

  expect(screen.getByText(/Ingresa un correo valido/i)).toBeInTheDocument();
});
```

**¿Qué hace?**

1. **Cambia el toggle** para activar modo email (en lugar de usuario UABC)
2. **Ingresa un email inválido**: "invalidemail" (sin @)
3. **Envía el formulario**
4. **Verifica** que aparezca el error: "Ingresa un correo válido"

**¿Por qué es importante?**
- Valida que el formato del email sea correcto
- Previene errores al intentar enviar emails a direcciones inválidas

---

### Test 3: No Mostrar Errores con Input Válido

```javascript
it("should not show errors when valid input is provided", () => {
  renderWithRouter(<Login />);

  const emailInput = screen.getByLabelText(/usuario/i);
  const passInput = screen.getByLabelText(/contraseña/i);

  fireEvent.change(emailInput, { target: { value: "user@uabc.edu.mx" } });
  fireEvent.change(passInput, { target: { value: "123456" } });

  const form = screen.getByRole("form");
  fireEvent.submit(form);

  expect(screen.queryByText(/Ingresa un correo valido/i)).toBeNull();
  expect(screen.queryByText(/Ingresa tu contraseña/i)).toBeNull();
  expect(screen.queryByText(/Ingresa tu usuario|Ingresa tu correo electronico/i)).toBeNull();
});
```

**¿Qué hace?**

1. **Llena el formulario con datos válidos**
   - Usuario: user@uabc.edu.mx
   - Contraseña: 123456
2. **Envía el formulario**
3. **Verifica** que NO aparezcan mensajes de error

**¿Por qué es importante?**
- Asegura que el formulario funcione correctamente con datos válidos
- Previene "falsos positivos" (errores que no deberían aparecer)

---

### Test 4: Renderizar Inputs de Usuario y Contraseña

```javascript
it("renders username/email and password inputs", () => {
  renderWithRouter(<Login />);
  const userInput = screen.getByLabelText(/usuario/i);
  const passInput = screen.getByLabelText(/contraseña/i);
  expect(userInput).toBeInTheDocument();
  expect(passInput).toBeInTheDocument();
});
```

**¿Qué hace?**
- Verifica que ambos inputs (usuario y contraseña) existan en el documento

---

## 🚀 ¿Cómo Ejecutar los Tests?

### Tests del Backend

#### Opción 1: Con Docker (Recomendado)

```bash
docker-compose exec backend npm test
```

#### Opción 2: Sin Docker

```bash
cd backend
npm install  # Solo la primera vez
npm test
```

### Tests del Frontend

```bash
cd frontend
npm test
```

---

## 📊 Interpretando los Resultados

### Resultado Exitoso

```
PASS ./server.test.js
  API de Pacientes
    POST /api/patients
      ✓ debe crear un nuevo paciente con todos los datos (46 ms)
      ✓ debe crear un paciente con solo datos requeridos (4 ms)
      ✓ debe retornar error 400 si falta el nombre (4 ms)
      ✓ debe retornar error 400 si falta el apellido (3 ms)
      ✓ debe retornar error 400 si falta la fecha de nacimiento (6 ms)
    GET /api/patients
      ✓ debe retornar todos los pacientes (4 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Time:        0.426 s
```

**Símbolos:**
- ✓ = Test pasó correctamente
- ✗ = Test falló
- (46 ms) = Tiempo que tardó el test

**Resumen:**
- `Test Suites`: Archivos de tests ejecutados
- `Tests`: Número total de tests individuales
- `Time`: Tiempo total de ejecución

---

### Resultado con Errores

```
FAIL ./server.test.js
  API de Pacientes
    POST /api/patients
      ✗ debe crear un nuevo paciente con todos los datos (46 ms)
      
      Expected: 201
      Received: 400
```

**¿Qué significa?**
- El test esperaba recibir código 201 (Created)
- Pero recibió código 400 (Bad Request)
- Hay un problema en el código que necesita ser corregido

---

## 🔍 Conceptos Clave de Testing

### Assertions (Afirmaciones)

Son verificaciones que hacen los tests:

```javascript
expect(response.status).toBe(201);  // Verifica que el status sea 201
expect(response.body).toHaveProperty('id');  // Verifica que tenga propiedad 'id'
expect(Array.isArray(data)).toBe(true);  // Verifica que sea un array
```

### Mocking (Simulación)

Simular comportamientos sin ejecutar código real:
- En nuestros tests, `supertest` simula peticiones HTTP sin necesidad de un navegador real

### Test Coverage (Cobertura)

Porcentaje de código que está siendo probado:
- **Alta cobertura** (>80%): Bien testeado
- **Baja cobertura** (<50%): Muchas partes sin probar

---

## 📚 Glosario

- **Test Suite**: Conjunto de tests relacionados
- **Test Case**: Un test individual
- **Assertion**: Verificación de que algo sea verdadero
- **Mock**: Simulación de un componente o función
- **Fixture**: Datos de prueba predefinidos
- **Integration Test**: Test que prueba múltiples componentes juntos
- **Unit Test**: Test que prueba una sola función o componente
- **Regression Test**: Test que verifica que bugs corregidos no vuelvan a aparecer

---

## 🎯 Mejores Prácticas

1. **Tests descriptivos**: El nombre del test debe explicar qué hace
   ```javascript
   // ✅ Bueno
   it('debe retornar error 400 si falta el nombre')
   
   // ❌ Malo
   it('test 1')
   ```

2. **Un concepto por test**: Cada test debe verificar una sola cosa

3. **Tests independientes**: Un test no debe depender de otro

4. **Datos realistas**: Usa datos que se parezcan a los reales

5. **Ejecuta tests frecuentemente**: Antes de hacer commit o push

---

## 🔮 Próximos Tests a Implementar

1. **Tests de edición de pacientes**
2. **Tests de eliminación de pacientes**
3. **Tests de búsqueda de pacientes**
4. **Tests de paginación**
5. **Tests de autenticación**
6. **Tests E2E (End-to-End)**: Probar el flujo completo desde el navegador

---

## 📞 Recursos Adicionales

- **Jest**: https://jestjs.io/
- **Supertest**: https://github.com/visionmedia/supertest
- **React Testing Library**: https://testing-library.com/react
- **Vitest**: https://vitest.dev/

---

## ✨ Conclusión

Los tests son una parte fundamental del desarrollo de software moderno. Nos dan **confianza** para hacer cambios, **detectan errores tempranamente** y **documentan** cómo debe funcionar el sistema.

**Recuerda:**
- Tests que pasan = ✅ Sistema funcionando correctamente
- Tests que fallan = ⚠️ Algo necesita ser corregido
- Sin tests = ❓ No sabemos si funciona correctamente
