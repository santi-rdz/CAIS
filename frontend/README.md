# 🎨 Frontend CAIS - React + Vite (La Interfaz God Tier)

## 🚀 ¿Qué es este pedo?

Este es el **frontend** del Sistema CAIS, armado con **React** y **Vite** pa' que sea rápido como rayo ⚡. Aquí vive toda la interfaz visual (lo bonito que ves en el navegador we).

## 🔥 Stack Tecnológico (Las Tools que Usamos)

- **React** - La librería más god pa' hacer interfaces
- **Vite** - Build tool ultra rápido (compila en chinga)
- **React Router** - Pa' navegar entre páginas
- **TailwindCSS** - Estilos aesthetic y rápidos
- **React Hot Toast** - Notificaciones bien bonitas
- **Vitest** - Framework de testing (pa' pruebas unitarias)
- **ESLint** - El policía del código (mantiene todo limpio)

## ⚡ Hot Module Replacement (HMR)

Este template trae HMR activado, que básicamente significa que cuando cambias algo en el código, se actualiza al instante en el navegador sin recargar la página. Está re piola we.

### Plugins Oficiales Disponibles:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)** - Usa Babel pa' Fast Refresh (el que usamos ahorita)
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)** - Usa SWC pa' Fast Refresh (más rápido pero experimental)

## 🧪 Tests (Pruebas Unitarias)

El frontend tiene tests con **Vitest** pa' asegurar que los componentes jalen bien:

```bash
npm test
```

**¿Qué se testea?** ✅
- Página de Login (que se renderice bien)
- Validaciones de formularios (que no dejen pasar datos malos)
- Componentes individuales (cada pieza por separado)

Pa' más detalles checa: [Guía de Tests](../GUIA_DE_TESTS.md)

## 🔍 ESLint (Control de Calidad)

Tenemos ESLint configurado pa' mantener el código limpio y consistente:

```bash
npm run lint
```

Esto checa que:
- No haya errores de sintaxis
- Sigas las mejores prácticas de React
- El código esté bien formateado

### ⚙️ Expandir la Configuración de ESLint

Si estás desarrollando una app de producción (en serio), te recomendamos usar **TypeScript** con reglas de linting type-aware. Checa el [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) pa' ver cómo integrar TypeScript y [`typescript-eslint`](https://typescript-eslint.io) en tu proyecto.

## 📦 Build (Compilar Pa' Producción)

Pa' compilar el frontend y dejarlo listo pa' producción:

```bash
npm run build
```

Esto genera una carpeta `dist/` con todos los archivos optimizados y minificados (bien chiquitos pa' que carguen rápido).

## 🎯 Comandos Útiles

```bash
npm run dev          # Corre el dev server (localhost:5173)
npm run build        # Compila pa' producción
npm run preview      # Preview del build de producción
npm test             # Corre los tests unitarios
npm run lint         # Checa la calidad del código
```

## 🌐 Integración con Backend

El frontend se comunica con el backend mediante **fetch** a la API REST:

```javascript
// Ejemplo de cómo se hace una petición
const response = await fetch('http://localhost:8000/api/patients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(patientData)
});
```

## 🔧 React Compiler (Experimental)

El React Compiler NO está activado en este template porque afecta el performance en desarrollo y build. Si lo quieres agregar, checa [esta documentación](https://react.dev/learn/react-compiler/installation).

## 🚀 Pa' Empezar (Setup Rápido)

1. **Instala dependencias:**
   ```bash
   npm install
   ```

2. **Corre el dev server:**
   ```bash
   npm run dev
   ```

3. **Abre tu navegador:**
   ```
   http://localhost:5173
   ```

¡Y listo we! Ya tienes el frontend corriendo 🔥💯

---

## 📚 Documentación Completa

Pa' entender todo el sistema completo, checa:
- [📋 README Principal](../readme.md) - Arquitectura completa del sistema
- [🧪 Guía de Tests](../GUIA_DE_TESTS.md) - Cómo hacer y correr tests
- [🔄 CI/CD Setup](../CI_CD_SETUP.md) - Automatización con GitHub Actions
