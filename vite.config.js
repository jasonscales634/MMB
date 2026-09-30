import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [react(), svgr()],

  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },

  // ✅ ADD THIS PART
  server: {
    allowedHosts: [
      'microfinancedevelopmentprojectbd.adcpa.live'
    ],
    proxy: {
      '/api': {
        target: 'https://loan-server-1-do86.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
