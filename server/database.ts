// BAZA DANYCH — jedyne miejsce, które czyta i zapisuje plik data/db.json.
// Działa jako mały serwer API wewnątrz `npm run dev`:
//   GET   /api/db → cała baza
//   PATCH /api/db → zapis zmian ({ settings?, days? }), zasada łączenia: src/data/changes.ts

import fs from 'node:fs'
import path from 'node:path'
import type { Connect, Plugin } from 'vite'
import { applyChanges } from '../src/data/changes'
import type { Database } from '../src/types'

const DB_FILE = path.resolve('data/db.json')

/** Baza przy pierwszym uruchomieniu */
const EMPTY_DB: Database = { settings: { mode: null, demoOffered: false }, days: {} }

function readDb(): Database {
  if (!fs.existsSync(DB_FILE)) return EMPTY_DB
  return applyChanges(EMPTY_DB, JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))) // uzupełnia brakujące pola
}

function writeDb(db: Database) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

const api: Connect.NextHandleFunction = (req, res, next) => {
  const reply = (data: unknown) => {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(data))
  }

  if (req.method === 'GET') return reply(readDb())

  if (req.method === 'PATCH') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      const db = applyChanges(readDb(), JSON.parse(body))
      writeDb(db)
      reply(db)
    })
    return
  }

  next()
}

export const databasePlugin = (): Plugin => ({
  name: 'json-database',
  configureServer: (server) => void server.middlewares.use('/api/db', api),
  configurePreviewServer: (server) => void server.middlewares.use('/api/db', api),
})
