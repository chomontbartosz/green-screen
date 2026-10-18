// BAZA DANYCH — jedyne miejsce, które rozmawia z MySQL. Baza na home.pl przyjmuje połączenia tylko z własnego
// serwera, więc zapytania idą przez most bridge/bridge.php (HTTPS + tajny klucz). Most zna tylko nazwane operacje
// poniżej i sam tworzy tabelę `users`. Dane użytkownika (dni i ustawienia) są w kolumnie `data` jako JSON.

import type { Database } from '../src/types.js'
import { BRIDGE } from './config.js'

export type UserRow = {
  id: number
  email: string
  password_hash: string
  guest_name: string
  verified: boolean
  failed_logins: number
  locked_until: Date | null
  data: Database
}

/** Błąd „taki rekord już istnieje” (np. ten sam e-mail). */
export class DuplicateError extends Error {}

async function bridge(op: string, params: unknown[], retry = op.startsWith('find')): Promise<Record<string, unknown> | null> {
  const res = await fetch(BRIDGE.url(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Bridge-Secret': BRIDGE.secret() },
    body: JSON.stringify({ op, params }),
  })
  const body = (await res.json().catch(() => ({}))) as { row?: Record<string, unknown> | null; error?: string }
  if (res.status === 409) throw new DuplicateError(op)
  if (res.status === 401) throw new Error('Most do bazy odrzucił klucz: BRIDGE_SECRET w Vercelu ≠ secret w bridge-config.php na home.pl')
  if (res.status >= 500 && retry) return bridge(op, params, false) // chwilowy błąd bazy — odczyt można bezpiecznie powtórzyć raz
  if (!res.ok) throw new Error(`Most do bazy: ${op} → ${res.status} ${body.error ?? ''}`)
  return body.row ?? null
}

/** MySQL zwraca daty jako tekst w UTC („2026-10-17 12:00:00”). */
const utcDate = (value: unknown) => (value ? new Date(`${String(value).replace(' ', 'T')}Z`) : null)
/** …i przyjmuje je w tym samym formacie. */
const toUtc = (date: Date | null) => (date ? date.toISOString().slice(0, 19).replace('T', ' ') : null)

async function one(op: string, params: unknown[]): Promise<UserRow | null> {
  const row = await bridge(op, params)
  if (!row) return null
  return {
    id: Number(row.id),
    email: String(row.email),
    password_hash: String(row.password_hash),
    guest_name: String(row.guest_name),
    verified: Number(row.verified) === 1,
    failed_logins: Number(row.failed_logins),
    locked_until: utcDate(row.locked_until),
    data: row.data as Database,
  }
}

const run = async (op: string, params: unknown[]) => void (await bridge(op, params))

export const findUserByEmail = (email: string) => one('findUserByEmail', [email])
export const findUserById = (id: number) => one('findUserById', [id])
export const findUserByVerifyToken = (token: string) => one('findUserByVerifyToken', [token])
export const findUserByResetToken = (token: string) => one('findUserByResetToken', [token])

export async function createUser(user: { email: string; passwordHash: string; guestName: string; verifyToken: string; data: Database }) {
  await run('createUser', [user.email, user.passwordHash, user.guestName, user.verifyToken, JSON.stringify(user.data)])
  return (await findUserByEmail(user.email))!
}

export const saveUserData = (id: number, data: Database) => run('saveUserData', [JSON.stringify(data), id])
export const markVerified = (id: number) => run('markVerified', [id])
export const setResetToken = (id: number, token: string, expires: Date) => run('setResetToken', [token, toUtc(expires), id])
export const setPassword = (id: number, passwordHash: string) => run('setPassword', [passwordHash, id])
export const recordFailedLogin = (id: number, lockUntil: Date | null) => run('recordFailedLogin', [toUtc(lockUntil), id])
export const clearFailedLogins = (id: number) => run('clearFailedLogins', [id])
