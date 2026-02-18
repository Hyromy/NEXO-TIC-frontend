/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0"
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/_setup.ts',
  },
})
