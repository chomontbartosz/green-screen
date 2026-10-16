// ZAPIS WYBORÓW UŻYTKOWNIKA — jedyne miejsce, przez które aplikacja rozmawia z bazą (server/database.ts).

import type { Database, DbChanges } from '../types'

const API_URL = '/api/db'

export async function loadDb(): Promise<Database> {
  const res = await fetch(API_URL)
  return res.json()
}

export async function saveChanges(changes: DbChanges): Promise<void> {
  await fetch(API_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  })
}
