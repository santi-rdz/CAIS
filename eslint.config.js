import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // Backend/Node.js files
  {
    files: ['backend/**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Vitest files (frontend)
  {
    files: ['frontend/**/*.test.{js,jsx}'],
    languageOptions: { globals: globals.vitest },
  },

  // Jest files (backend)
  {
    files: ['backend/**/*.test.{js,mjs,cjs}'],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },

  // Frontend/React files
  {
    files: ['frontend/**/*.{js,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },

  pluginReact.configs.flat.recommended,

  {
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  prettier,
])
