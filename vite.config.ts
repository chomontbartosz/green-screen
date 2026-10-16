import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { databasePlugin } from './server/database'

export default defineConfig({
  plugins: [react(), tailwindcss(), databasePlugin()],
  publicDir: 'ikonki', // ikony owoców i warzyw są serwowane z folderu ikonki/
  server: { watch: { ignored: ['**/data/**'] } }, // zapis do bazy nie przeładowuje strony
})
