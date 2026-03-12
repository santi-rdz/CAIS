# Zod — Guía para el equipo

Zod es la librería de validación de schemas que usamos en el backend para verificar los datos que llegan en cada request. Antes de que un controlador pase datos al modelo, los valida con Zod.

---

## Por qué Zod

Sin validación, cualquier dato llega al modelo y de ahí a la DB — lo que provoca errores de constraint en MySQL, crashes, o silenciosamente guarda basura. Zod valida la forma y el tipo del objeto antes de procesarlo, y retorna errores descriptivos por campo que el frontend puede mostrar directamente al usuario.

Se eligió sobre alternativas como Joi o Yup porque su API es más concisa y su comunidad es más activa. En proyectos TypeScript también ofrece inferencia de tipos automática, aunque en CAIS usamos JavaScript puro.

---

## El patrón que usamos: `safeParse`

Hay dos formas de validar con Zod:

```js
// .parse() — lanza una excepción si falla
schema.parse(input) // ❌ fuerza un try/catch

// .safeParse() — retorna un objeto con el resultado
schema.safeParse(input) // ✅ lo que usamos siempre
```

`.safeParse()` nunca lanza. Retorna un objeto con forma de discriminated union:

```js
// Si pasa la validación:
{ success: true, data: { ... } }

// Si falla:
{ success: false, error: ZodError }
```

En el controlador siempre se hace:

```js
const result = validateAlgo(req.body)
if (!result.success) {
  return res.status(422).json({
    error: 'ValidationError',
    fields: formatZodErrors(result.error),
  })
}
// A partir de aquí result.data está validado y seguro de usar
const data = result.data
```

---

## Tipos básicos

```js
import z from 'zod'

z.string()
z.number()
z.boolean()
z.date()
z.undefined()
z.null()
z.any()
```

---

## Validaciones de string

```js
z.string().min(2, 'Mínimo 2 caracteres')
z.string().max(100, 'Máximo 100 caracteres')
z.string().email('Correo inválido')
z.string().uuid('UUID inválido')
z.string().url('URL inválida')
z.string().regex(/^\d{10}$/, 'Debe tener 10 dígitos')
z.string().trim() // elimina espacios al inicio y al final
z.string().toLowerCase() // normaliza a minúsculas
```

Ejemplo real del proyecto (`schemas/register.js`):

```js
const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[!@#$%^&*]/, 'Debe contener al menos un carácter especial (!@#$%^&*)')

const telefonoSchema = z
  .string()
  .regex(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')
```

---

## Objetos

```js
const schema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  correo: z.string().email('Correo inválido'),
  edad: z.number().int().min(18, 'Debe ser mayor de edad'),
})
```

### `.partial()` — todos los campos opcionales

Para endpoints de actualización (PATCH), donde no se requiere enviar todos los campos:

```js
// Todos los campos pasan a ser opcionales
const updateSchema = schema.partial()

// Solo algunos campos opcionales
const partialSchema = schema.partial({ nombre: true })
```

Ejemplo del proyecto (`schemas/user.js`):

```js
export function validatePartialUser(input) {
  return baseSchema.partial().safeParse(input)
}
```

### `.extend()` — agregar campos a un schema existente

Cuando varios schemas comparten una base común:

```js
const baseSchema = z.object({
  nombre: z.string().min(2),
  correo: z.string().email(),
  password: passwordSchema,
})

const internSchema = baseSchema.extend({
  matricula: z.string().min(1, 'La matrícula es requerida'),
  servicioInicioAnio: z.string(),
})

const coordinadorSchema = baseSchema.extend({
  cedula: z.string().min(1, 'La cédula es requerida'),
})
```

`.extend()` no modifica el schema original — retorna uno nuevo. Así se puede compartir la base y especializar sin duplicar código.

---

## Enums

```js
const rolSchema = z.enum(['pasante', 'coordinador'], {
  errorMap: () => ({ message: 'El rol debe ser pasante o coordinador' }),
})
```

Sin `errorMap`, el mensaje de error por defecto de Zod en inglés. Con `errorMap` se puede personalizar.

---

## Campos opcionales y nullables

```js
z.string().optional() // acepta string | undefined
z.string().nullable() // acepta string | null
z.string().nullish() // acepta string | null | undefined
```

Útil en campos de DB que pueden ser `NULL`:

```js
const schema = z.object({
  cedula: z.string().optional(),
  matricula: z.string().optional(),
})
```

---

## `.refine()` — validaciones cruzadas entre campos

Para validar una condición que involucra más de un campo del objeto. El caso más común es confirmar contraseñas:

```js
const registrationSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // a qué campo se adjunta el error
  })
```

El `path` es importante: indica en qué campo debe mostrarse el error. Sin él, el error queda en el nivel raíz del objeto y el frontend no puede mapearlo a un campo específico del formulario.

---

## `formatZodErrors` — errores para el frontend

Cuando `.safeParse()` falla, `result.error` es un `ZodError` con un array de `issues`. Cada issue tiene `path` (ruta al campo) y `message`. El helper `formatZodErrors` de `src/lib/formatErrors.js` los convierte en un formato que el frontend puede usar directamente:

```js
// Entrada: ZodError con issues
[
  { path: ['correo'], message: 'Correo inválido' },
  { path: ['telefono'], message: 'El teléfono debe tener 10 dígitos' },
]

// Salida de formatZodErrors:
[
  { field: 'correo', message: 'Correo inválido' },
  { field: 'telefono', message: 'El teléfono debe tener 10 dígitos' },
]
```

Si el error no tiene path (es decir, es un error de nivel de objeto como el de `.refine()`), el campo sale como `'_form'`.

Siempre usa este helper en lugar de serializar el error de Zod directamente — el formato de `ZodError` es interno y puede cambiar entre versiones.

---

## Estructura de un schema en el proyecto

Por convención, cada schema vive en `src/schemas/nombreDelRecurso.js` y exporta funciones de validación, no el schema directamente:

```js
// src/schemas/reporte.js
import z from 'zod'

const reporteSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  tipo: z.enum(['medico', 'nutricion'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),
  fecha: z.string(),
})

// Para POST (todos los campos requeridos)
export function validateReporte(input) {
  return reporteSchema.safeParse(input)
}

// Para PATCH (todos los campos opcionales)
export function validatePartialReporte(input) {
  return reporteSchema.partial().safeParse(input)
}
```

No exportes el schema como `export const reporteSchema` para que el controlador lo use directo. Exporta funciones — así si el schema cambia internamente (por ejemplo, añades `.transform()`), el controlador no necesita modificarse.

---

## Qué no hace Zod

Zod valida **forma y tipo** de los datos. No valida contra la DB. Ejemplos de lo que Zod no puede hacer:

- Verificar si un correo ya está registrado (eso es una query a DB, no una validación de tipo)
- Verificar si un token existe y no ha expirado
- Verificar si un UUID referencia un registro que existe

Esas validaciones van en el controlador o en el modelo, después de que Zod ya validó los tipos básicos.
