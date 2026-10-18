// Vercel: każdy adres /api/<nazwa> trafia tutaj i jest obsługiwany przez server/routes.ts.

import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleApi } from '../server/routes.js'

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const name = new URL(req.url ?? '/', 'http://x').pathname.split('/').filter(Boolean).at(-1) ?? ''
  return handleApi(name, req, res)
}
