El componente `Button` es un elemento de interfaz de usuario personalizable para renderizar botones. Soporta diferentes estilos visuales (`primary`, `secondary`, `outline`) y tamaños (`sm`, `md`, `lg`).

### Propiedades (Props)

*   `children`: El contenido a mostrar dentro del botón (p. ej., texto, iconos).
*   `type`: (Opcional) El estilo visual del botón. Acepta `'primary'`, `'secondary'` u `'outline'`. Por defecto es `'primary'`.
    *   `primary`: `bg-green-800 text-white hover:bg-green-900`
    *   `secondary`: `bg-white border border-green-800 hover:bg-green-100`
    *   `outline`: `bg white ring ring-gray-200 hover:bg-gray-100`
*   `size`: (Opcional) El tamaño del botón. Acepta `'sm'`, `'md'` o `'lg'`. Por defecto es `'lg'`.
    *   `sm`: `text-6 px-2 py-1 rounded-sm font-semibold`
    *   `md`: `text-5 px-4 py-2.5 rounded-lg font-medium`
    *   `lg`: `text-5 px-6 py-3.5 rounded-lg font-medium`
*   `className`: (Opcional) Permite aplicar clases CSS personalizadas adicionales al botón.
*   `...props`: Cualquier otro atributo estándar de botón HTML (p. ej., `onClick`, `disabled`).

El componente construye dinámicamente las clases CSS del botón basándose en las propiedades proporcionadas, asegurando una apariencia y sensación consistentes mientras permite flexibilidad. También incluye estilos para estados deshabilitados.
