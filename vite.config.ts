import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    port: 4321,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 4321,
    strictPort: true,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
})
