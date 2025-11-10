import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/trip-cherry/",
  plugins: [react()],
  server: {
    allowedHosts: ["98d6071060f9.ngrok-free.app"],
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
})
