// Lokalnie (`npm run dev`): to samo API co na Vercelu, podpięte pod serwer Vite.

import type { Plugin } from 'vite'
import { handleApi } from './routes.js'

export const apiDevPlugin = (): Plugin => ({
  name: 'green-screen-api',
  configureServer(server) {
    server.middlewares.use('/api', (req, res) => {
      const name = new URL(req.url ?? '/', 'http://x').pathname.replace(/^\//, '')
      void handleApi(name, req, res)
    })
  },
})
