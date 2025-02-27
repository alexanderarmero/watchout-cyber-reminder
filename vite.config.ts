
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Ensure proper base path for Electron
  base: process.env.ELECTRON === 'true' ? './' : '/',
  // Configure server with the required port 8080
  server: {
    port: 8080,
    open: false
  }
})
