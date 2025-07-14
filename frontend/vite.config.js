import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  base: '/', // Updated for Vercel deployment to avoid 404 errors
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      external: ["react-datepicker"],
      output: {
        globals: {
          "react-datepicker": "ReactDatepicker"
        }
      }
    }
  }
})

