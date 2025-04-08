import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // Esto permite acceso externo
    port: 5173       // Puedes cambiar el puerto si ya está ocupado
  }
})
