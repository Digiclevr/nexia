import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 6003,
    proxy: {
      '/api': {
        target: 'http://localhost:6000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
