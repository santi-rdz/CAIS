# Por qué usamos estas tecnologías

Decisiones técnicas del proyecto y el razonamiento detrás de cada una.

---

## Backend

### Node.js + Express 5

Node.js es el entorno de ejecución más natural para un equipo que ya trabaja con JavaScript en el frontend. Compartir el mismo lenguaje en ambos lados reduce el costo de context-switching y permite reutilizar lógica de validación (los schemas de Zod, por ejemplo, podrían vivir en un paquete compartido en el futuro).

Express 5 (actualmente en uso) tiene una mejora importante respecto a Express 4: el manejo automático de errores en handlers async. En Express 4 era necesario envolver cada handler con un `try/catch` o usar un wrapper; en Express 5, los errores no capturados en handlers `async` se propagan al middleware de error automáticamente.

Express es deliberadamente minimalista. No impone una estructura de proyecto, no viene con ORM ni con sistema de autenticación propio. Eso nos da control total sobre cada pieza: elegimos Prisma para la DB, `express-session` para autenticación, y Zod para validación — en lugar de aceptar las decisiones de un framework opinionado.

### Prisma

La alternativa más común sería escribir SQL directamente con `mysql2`, o usar Sequelize. Descartamos SQL crudo porque el schema tiene decenas de tablas con relaciones complejas — mantener queries a mano escala mal y los errores de tipeo en strings SQL son difíciles de detectar. Descartamos Sequelize porque su API es más verbosa y el soporte de TypeScript es secundario (fue diseñado antes de que TS fuera común).

Prisma genera un cliente tipado a partir del schema, lo que significa que los campos de cada tabla están disponibles como autocompletado y los errores de acceso a campos inexistentes se detectan temprano. También centraliza la definición del modelo en un solo archivo (`prisma/schema.prisma`), que sirve como fuente de verdad de la estructura de la DB.

El flujo que usamos es **introspección**: la DB ya existía, así que en lugar de definir el schema manualmente corremos `npx prisma db pull` para generarlo desde las tablas existentes. Esto es menos común que el flujo "schema-first" pero es el correcto cuando se hereda una DB existente.

Más detalles en [`docs/prisma.md`](./prisma.md).

### Zod

La validación de datos de entrada es obligatoria en cualquier API. Zod permite definir el shape esperado de un objeto y validarlo con una sola llamada. El resultado de `.safeParse()` es un objeto con `{ success, data }` o `{ success: false, error }` — sin excepciones, sin try/catch adicionales.

La ventaja sobre alternativas como Joi o Yup es que Zod fue diseñado desde cero con TypeScript en mente. En un proyecto JavaScript puro (como este) eso no cambia mucho, pero la comunidad es más activa y la API es más concisa.

En CAIS usamos Zod para validar el body de cada endpoint antes de pasarlo al modelo. Si la validación falla, el controlador retorna 422 con los campos específicos que fallaron (ver `src/lib/formatErrors.js`).

### bcryptjs

Las contraseñas nunca se guardan en texto plano. `bcryptjs` implementa el algoritmo bcrypt, que aplica un hash con un factor de trabajo (cost factor) configurable. El costo 12 que usamos significa que cada hash tarda ~250ms en generarse — suficientemente lento para que un ataque de fuerza bruta sea imprácticamente caro, pero imperceptible para el usuario en un login normal.

Se eligió `bcryptjs` (implementación pura en JS) sobre `bcrypt` (nativo en C++) porque no requiere compilación nativa, lo que simplifica el Dockerfile y evita problemas en diferentes arquitecturas.

### express-session + PrismaSessionStore

Ver [`docs/express-session.md`](./express-session.md) para la explicación completa.

La versión corta: usamos sesiones en DB en lugar de JWT porque el sistema es interno, tenemos pocos usuarios concurrentes, y necesitamos poder revocar sesiones inmediatamente (forzar logout, bloquear un usuario). Con JWT eso no es posible sin infraestructura adicional.

---

## Frontend

### React 19

El uso de React aceleró el arranque del proyecto ya que contabamos con cierta experiencia. React 19 introduce mejoras en el compilador y en el manejo de formularios, pero la razón principal es pragmática: es la versión más estable y mejor soportada del ecosistema al momento de iniciar CAIS.

### Vite

Create React App (la alternativa histórica) fue deprecado en 2023. Vite reemplaza tanto el bundler de desarrollo como el de producción — usa esbuild para transformaciones y Rollup para el build final. El resultado es un servidor de desarrollo que arranca en menos de un segundo y un HMR (Hot Module Replacement) casi instantáneo, incluso en proyectos grandes.

### Tailwind CSS v4

Tailwind CSS v4 cambia el modelo de configuración: en lugar de un archivo `tailwind.config.js`, la configuración vive en CSS usando variables y directivas nativas. Esto reduce la cantidad de archivos de configuración y acerca Tailwind al estándar de CSS moderno.

La razón de usar Tailwind sobre CSS puro o un sistema de componentes como MUI es que facilita la consistencia visual sin imponer un design system ajeno. Los estilos viven junto al componente que los usa — no hay que buscar en una hoja de estilos separada qué clase aplica a qué elemento.

### TanStack Query v5

Todo el estado del servidor vive en TanStack Query (antes React Query). Las alternativas serían Redux + Redux Toolkit, Zustand, o manejar el estado con `useState` + `useEffect` directo.

Redux fue descartado porque agrega mucho boilerplate para lo que CAIS necesita. `useState` + `useEffect` para fetch de datos funciona en proyectos pequeños pero escala mal: hay que manejar manualmente loading states, errores, caché, refetch al volver a la pestaña, etc. TanStack Query resuelve todo eso con una API declarativa.

La versión 5 introduce una API ligeramente diferente a v4 (el objeto de opciones cambió) — todos los hooks deben usarse con la forma de v5.

### React Hook Form

Los formularios en CAIS son complejos: multi-step, con validaciones por campo, y en algunos casos comparten estado entre pasos. React Hook Form gestiona el estado del formulario de forma no controlada (los inputs no se re-renderizan en cada keystroke), lo que lo hace más eficiente que controlar el estado con `useState` para cada campo.

La integración con Zod es directa mediante el resolver de `@hookform/resolvers/zod` — el mismo schema que valida el body en el backend puede reutilizarse en el frontend para validar el formulario.

### React Router v7

React Router v7 introduce el modo de framework (similar a Remix), pero en CAIS lo usamos en modo SPA clásico con `createBrowserRouter`. Las rutas están definidas en `src/App.jsx` y usan el patrón de layout con `<Outlet />` para compartir el AppLayout entre rutas protegidas.

### Sonner

Biblioteca de toasts (notificaciones). Se eligió sobre `react-hot-toast` o `react-toastify` por su API más simple y su integración con Tailwind sin configuración extra.

---

## Infraestructura

### Docker + Docker Compose

El proyecto tiene tres servicios (frontend, backend, DB) que deben arrancar en orden y comunicarse entre sí. Docker Compose orquesta eso con un solo comando. Sin Docker, cada desarrollador tendría que instalar MySQL localmente, configurar el usuario y la contraseña, y asegurarse de que el puerto no esté ocupado.

Con Docker, la DB siempre arranca en las mismas condiciones, con el mismo usuario y contraseña, y el schema inicial se aplica automáticamente desde `database/`. El volumen `db_data` persiste los datos entre reinicios del container.

Los volúmenes `frontend_node_modules` y `backend_node_modules` evitan que el `npm install` dentro del container sobreescriba la carpeta local del host — un problema clásico en setups de Docker con Node.js en Mac/Windows.

### MySQL 8

La DB fue diseñada para MySQL. Se usa la imagen oficial `mysql:8.0` en Docker. El puerto se expone en `3307` (en lugar del estándar 3306) para evitar conflictos si el desarrollador tiene MySQL instalado localmente.
