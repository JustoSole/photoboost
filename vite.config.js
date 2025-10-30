import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // IMPORTANTE: Cuando uses vercel dev, NO uses este servidor directamente
    // vercel dev ejecutará vite internamente y manejará las rutas /api/*
    port: 3000,
    open: true
  }
})

