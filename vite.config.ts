import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { apiDevPlugin } from './server/devPlugin'

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), '')) // sekrety z .env.local dla lokalnego API
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    publicDir: 'ikonki', // ikony owoców i warzyw są serwowane z folderu ikonki/
  }
})
