import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './', 
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
       '/api':{
        target: "https://api.readify.space",
        changeOrigin: true
       }
    }
  }
})