import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    // 1. Waxaan u qeexaynaa port-ka caadiga ah iyo qaabaynta HMR
    // port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    // 2. Polling-ka Windows-ka si uusan u daahin
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
