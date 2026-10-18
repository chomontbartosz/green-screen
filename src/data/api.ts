// ZAPIS WYBORÓW UŻYTKOWNIKA — jedyne miejsce, przez które aplikacja rozmawia z serwerem (server/routes.ts).
// Gość zapisuje w przeglądarce (localDb.ts), zalogowany na koncie w MySQL. Zmiany do serwera są łączone
// i wysyłane paczką co pół sekundy, żeby np. wpisywanie gramów nie wysyłało zapytania przy każdej cyfrze.

import type { Database, DbChanges, User } from '../types'
import { mergeChanges } from './changes'

type Session = { user: User; db: Database }

async function call<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(`/api/${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    keepalive: method === 'PATCH', // zapis dokończy się nawet przy zamykaniu karty
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Brak połączenia z serwerem.')
  return data
}

/** Zalogowany użytkownik z danymi albo null (gość lub serwer niedostępny). */
export async function loadSession(): Promise<Session | null> {
  try {
    const data = await call<{ user: User | null; db?: Database }>('me')
    return data.user && data.db ? { user: data.user, db: data.db } : null
  } catch {
    return null
  }
}

let pending: DbChanges | null = null
let timer: ReturnType<typeof setTimeout> | undefined

function flush() {
  clearTimeout(timer)
  if (!pending) return
  const changes = pending
  pending = null
  call('db', 'PATCH', changes).catch((error) => console.error('Nie udało się zapisać zmian:', error))
}

/** Zapis zmian na koncie (zbiera zmiany przez 0,5 s i wysyła jedną paczką). */
export function queueServerChanges(changes: DbChanges) {
  pending = mergeChanges(pending, changes)
  clearTimeout(timer)
  timer = setTimeout(flush, 500)
}

if (typeof window !== 'undefined') window.addEventListener('pagehide', flush)

export const register = (email: string, password: string, guestName: string, db: Database) =>
  call<Session>('register', 'POST', { email, password, guestName, db })
export const login = (email: string, password: string, db: Database) => call<Session>('login', 'POST', { email, password, db })
export const logout = () => call('logout', 'POST')
export const forgotPassword = (email: string) => call('forgot', 'POST', { email })
export const resetPassword = (token: string, password: string) => call<Session>('reset', 'POST', { token, password })
