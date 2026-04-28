import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,  // ← bloque si le port est pris, n'incrémente pas
  },
  // ... reste de la config
})